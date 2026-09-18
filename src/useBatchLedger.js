import { useCallback, useEffect, useRef, useState } from 'react'
import CONFIG from './tracegood.config.js'

/*
  useBatchLedger -- live XRP figures for one batch wallet, converted to EUR.

  Uses a WebSocket rather than HTTP on purpose: WebSocket connections are NOT
  subject to CORS. There is no preflight and no Access-Control-Allow-Origin
  check, so this works from any domain with no proxy and no server changes.

    raised       XRP pledged in   (memo t:"forward")
    transferred  XRP sent onward  (memo t:"relegate")

  The activation float carries memo t:"activate", so it is not a forward and
  never counts.

  It also subscribes to the account, so the ledger pushes changes the moment
  they validate -- updates land in about a second rather than on a poll tick.
  A slow re-query still runs as a safety net in case a push is missed.
*/

const RIPPLE_EPOCH = 946684800 // XRPL counts seconds from 2000-01-01

function readMemo(tx) {
  for (const m of tx.Memos || []) {
    const hex = m?.Memo?.MemoData
    if (!hex) continue
    try {
      let s = ''
      for (let i = 0; i < hex.length; i += 2) s += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
      const o = JSON.parse(s)
      if (o && typeof o === 'object') return o
    } catch {
      /* not ours */
    }
  }
  return {}
}

function tally(transactions, address, masterAddress) {
  let raised = 0
  let transferred = 0
  let latestTx = null

  for (const entry of transactions || []) {
    const tx = entry.tx_json || entry.tx || entry
    const meta = entry.meta || entry.metaData || {}

    if (tx.TransactionType !== 'Payment') continue
    if ((meta.TransactionResult || 'tesSUCCESS') !== 'tesSUCCESS') continue

    // rippled renamed this field; a non-string amount is an issued currency.
    const amount = tx.DeliverMax || tx.Amount
    if (typeof amount !== 'string') continue

    const xrp = Number(amount) / 1e6
    const memo = readMemo(tx)
    const inbound = tx.Destination === address

    if (inbound && memo.t === 'forward') {
      if (masterAddress && tx.Account !== masterAddress) continue
      raised += xrp
    } else if (!inbound && memo.t === 'relegate') {
      transferred += xrp
    } else {
      continue
    }

    const ledger = entry.ledger_index || tx.ledger_index || 0
    if (!latestTx || ledger > latestTx.ledger) {
      latestTx = {
        ledger,
        hash: entry.hash || tx.hash || '',
        when: entry.close_time_iso
          ? new Date(entry.close_time_iso)
          : tx.date != null
            ? new Date((Number(tx.date) + RIPPLE_EPOCH) * 1000)
            : null,
      }
    }
  }

  return { raised, transferred, latestTx }
}

export default function useBatchLedger(overrides = {}) {
  const cfg = { ...CONFIG, ...overrides }
  const address = cfg.batchAddress

  const [data, setData] = useState({
    raised: 0,
    transferred: 0,
    latestTx: null,
    status: address ? 'connecting' : 'unconfigured',
  })
  const [rate, setRate] = useState(cfg.fallbackRate)
  const [rateLive, setRateLive] = useState(false)

  const wsRef = useRef(null)
  const serverRef = useRef(0)
  const reqRef = useRef(1)
  const closedRef = useRef(false)

  const query = useCallback(() => {
    const ws = wsRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN) return
    ws.send(
      JSON.stringify({
        id: `tx-${reqRef.current++}`,
        command: 'account_tx',
        account: address,
        ledger_index_min: -1,
        ledger_index_max: -1,
        limit: 200,
      }),
    )
  }, [address])

  useEffect(() => {
    if (!address) return undefined
    closedRef.current = false

    let retry
    let heartbeat

    const connect = () => {
      if (closedRef.current) return

      const servers = cfg.wsEndpoints
      const url = servers[serverRef.current % servers.length]
      let ws
      try {
        ws = new WebSocket(url)
      } catch {
        serverRef.current += 1
        retry = setTimeout(connect, 2000)
        return
      }
      wsRef.current = ws

      ws.onopen = () => {
        setData((d) => ({ ...d, status: 'live' }))
        // Push notifications the instant a transaction validates.
        ws.send(JSON.stringify({ id: 'sub', command: 'subscribe', accounts: [address] }))
        query()
      }

      ws.onmessage = (event) => {
        let msg
        try {
          msg = JSON.parse(event.data)
        } catch {
          return
        }

        // Response to our account_tx query.
        if (msg.result && Array.isArray(msg.result.transactions)) {
          const { raised, transferred, latestTx } = tally(
            msg.result.transactions,
            address,
            cfg.masterAddress,
          )
          setData({ raised, transferred, latestTx, status: 'live' })
          return
        }

        // A transaction touching this account just validated -> re-query.
        if (msg.type === 'transaction' && msg.validated) query()
      }

      ws.onerror = () => {
        setData((d) => ({ ...d, status: 'stale' }))
      }

      ws.onclose = () => {
        if (closedRef.current) return
        setData((d) => ({ ...d, status: 'stale' }))
        serverRef.current += 1 // try the next server on reconnect
        retry = setTimeout(connect, 2000)
      }
    }

    connect()

    // Safety net in case a push is ever missed.
    heartbeat = setInterval(query, 10000)

    const onVisible = () => {
      if (!document.hidden) query()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      closedRef.current = true
      clearTimeout(retry)
      clearInterval(heartbeat)
      document.removeEventListener('visibilitychange', onVisible)
      if (wsRef.current) wsRef.current.close()
    }
  }, [address, cfg.wsEndpoints, cfg.masterAddress, query])

  // Rate: once on mount, not polled.
  useEffect(() => {
    let cancelled = false
    fetch(cfg.rateUrl)
      .then((r) => r.json())
      .then((j) => {
        const v = j?.ripple?.eur
        if (!cancelled && typeof v === 'number' && v > 0) {
          setRate(v)
          setRateLive(true)
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [cfg.rateUrl])

  return {
    ...data,
    address,
    configured: Boolean(address),
    rate,
    rateLive,
    raisedEur: data.raised * rate,
    transferredEur: data.transferred * rate,
    explorerTx: cfg.explorerTx,
    explorerAccount: cfg.explorerAccount,
    refresh: query,
  }
}
