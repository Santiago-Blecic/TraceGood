/*
  TraceGood live-ledger config.

  batchAddress comes from `python cli.py setup`. Because wallets are created
  fresh before a demo, the URL always wins over the constant below, so you can
  point the deployed site at a new wallet without rebuilding:

      ?batch=rXXXXX
      ?batch=rXXXXX&master=rYYYYY

  `python cli.py url batch1` prints the full link.
*/

const params =
  typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams()

export const CONFIG = {
  // Paste an address here for a permanent default, or leave blank and use ?batch=
  batchAddress: params.get('batch') || '',

  // Optional. If set, a pledge only counts when it actually came from the
  // master wallet -- a memo alone proves nothing, anyone can attach one.
  masterAddress: params.get('master') || '',

  /*
    WebSocket endpoints. WebSockets are NOT subject to CORS -- no preflight,
    no Access-Control-Allow-Origin check -- so this works from any domain
    with no proxy. Tried in order; it moves to the next one on a failure.
  */
  wsEndpoints: [
    'wss://testnet.xrpl-labs.com/',
    'wss://s.altnet.rippletest.net:51233/',
    'wss://clio.altnet.rippletest.net:51233/',
  ],

  // Fetched once on mount, never polled.
  rateUrl: 'https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=eur',
  fallbackRate: 0.5,

  explorerTx: 'https://testnet.xrpl.org/transactions/',
  explorerAccount: 'https://testnet.xrpl.org/accounts/',
}

export default CONFIG
