import { toNumber } from 'lodash'
import { map, merge } from 'rxjs'
import { subject as binance } from './subjects/binance'
import { subject as coinbase } from './subjects/coinbase'

type Ticker = {
  symbol: string
  exchange: string
  bid: number
  ask: number
  time: Date
}

const coinbase$ = coinbase.pipe<Ticker>(
  map(({ product_id, best_bid: bid, best_ask: ask, time }) => ({
    exchange: 'coinbase',
    symbol: product_id.replace('-', ''),
    bid: toNumber(bid),
    ask: toNumber(ask),
    time: new Date(time),
  }))
)

const binance$ = binance.pipe<Ticker>(
  map(({ s: symbol, b: bid, a: ask }) => ({
    exchange: 'binance',
    symbol,
    bid: toNumber(bid),
    ask: toNumber(ask),
    time: new Date(),
  }))
)

merge(coinbase$, binance$).subscribe({
  next: console.log,
  error: console.error,
})
