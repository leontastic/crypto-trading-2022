import { map, merge } from 'rxjs'
import { Ticker } from '../types'
import binance from './binance'
import coinbase from './coinbase'

const coinbase$ = coinbase.pipe<Ticker>(
  map(({ product_id, best_bid: bid, best_ask: ask, time }) => ({
    exchange: 'coinbase',
    symbol: product_id.replace('-', ''),
    bid,
    ask,
    time: new Date(time).toISOString(),
  }))
)

const binance$ = binance.pipe<Ticker>(
  map(({ s: symbol, b: bid, a: ask }) => ({
    exchange: 'binance',
    symbol,
    bid,
    ask,
    time: new Date().toISOString(),
  }))
)

export default merge(coinbase$, binance$)
