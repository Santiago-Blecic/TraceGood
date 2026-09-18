import { useCallback, useEffect, useRef, useState } from 'react'
import CONFIG from './tracegood.config.js'

/*
  useBatchLedger -- live XRP figures for one batch wallet, converted to EUR.

    raised       XRP pledged into this batch  (memo t:"forward")
    transferred  XRP sent on to the charity   (memo t:"relegate")

  The wallet activation float carries memo t:"activate", so it is simply not
  a forward and never counts. Nothing else to configure.

  On a network error the last good figures are kept and status goes 'stale';
  it never renders zeros during a blip.
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

  const endpoint = useRef(0)
  const fails = useRef(0)

  const refresh = useCallback(async () => {
    if (!address) return

    let result = null
    for (let i = 0; i < cfg.endpoints.length; i++) {
      const idx = (endpoint.current + i) % cfg.endpoints.length
      try {
        const ctrl = new AbortController()
        const timer = setTimeout(() => ctrl.abort(), 8000)
        const res = await fetch(cfg.endpoints[idx], {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: 'account_tx',
            params: [{ account: address, ledger_index_min: -1, ledger_index_max: -1, limit: 200 }],
          }),
          signal: ctrl.signal,
        })
        clearTimeout(timer)
        if (!res.ok) continue
        const json = await res.json()
        if (!json.result || (json.result.error && json.result.error !== 'actNotFound')) continue
        endpoint.current = idx
        result = json.result
        break
      } catch {
        /* try the next endpoint */
      }
    }

    if (!result) {
      fails.current += 1
      setData((d) => ({ ...d, status: fails.current > 3 ? 'offline' : 'stale' }))
      return
    }

    let raised = 0
    let transferred = 0
    let latestTx = null

    for (const entry of result.transactions || []) {
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
        if (cfg.masterAddress && tx.Account !== cfg.masterAddress) continue
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

    fails.current = 0
    setData({ raised, transferred, latestTx, status: 'live' })
  }, [address, cfg.endpoints, cfg.masterAddress])

  useEffect(() => {
    if (!address) return undefined
    refresh()
    const id = setInterval(refresh, cfg.pollMs)
    const onVisible = () => !document.hidden && refresh()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [address, cfg.pollMs, refresh])

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
    refresh,
  }
}
