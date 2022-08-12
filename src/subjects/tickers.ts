import { toNumber } from 'lodash'
import { map, merge } from 'rxjs'
import binance from './binance'
import coinbase from './coinbase'

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

export default merge(coinbase$, binance$)
