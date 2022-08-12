import { concat, set, sortBy, toNumber } from 'lodash'
import { combineLatestWith, map, scan, throttleTime } from 'rxjs'
import { subject as binance } from './subjects/binance'
import { subject as coinbase } from './subjects/coinbase'

type Ticker = {
  symbol: string
  exchange: string
  bid: number
  ask: number
  time: Date
}

const coinbase$ = coinbase.pipe(
  scan(
    (tickers, { product_id, best_bid: bid, best_ask: ask, time }) =>
      set(tickers, product_id, {
        exchange: 'coinbase',
        symbol: product_id.replace('-', ''),
        bid: toNumber(bid),
        ask: toNumber(ask),
        time: new Date(time),
      }),
    {} as Record<string, Ticker>
  ),
  map((tickerMap) => Object.values(tickerMap))
)

const binance$ = binance.pipe(
  scan(
    (tickers, { s: symbol, b: bid, a: ask }) =>
      set(tickers, symbol, {
        symbol,
        exchange: 'binance',
        bid: toNumber(bid),
        ask: toNumber(ask),
        time: new Date(),
      }),
    {} as Record<string, Ticker>
  ),
  map((tickerMap) => Object.values(tickerMap))
)

coinbase$
  .pipe(
    combineLatestWith(binance$),
    throttleTime(500),
    map((tickers) => sortBy(concat(...tickers), 'symbol'))
  )
  .subscribe({
    next(tickers) {
      console.clear()
      console.log(new Date().toISOString())
      console.table(tickers)
    },
    error: console.error,
  })
