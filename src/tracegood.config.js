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

  // '/xrpl' is same-origin, so CORS cannot apply. Backed by the Vite dev
  // proxy or the Worker. If neither is present it 404s and the public
  // endpoints below are used instead.
  endpoints: [
    '/xrpl',
    'https://testnet.xrpl-labs.com/',
    'https://s.altnet.rippletest.net:51234/',
  ],

  pollMs: 3000,

  // Fetched once on mount, never polled.
  rateUrl: 'https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=eur',
  fallbackRate: 0.5,

  explorerTx: 'https://testnet.xrpl.org/transactions/',
  explorerAccount: 'https://testnet.xrpl.org/accounts/',
}

export default CONFIG
