import process from 'node:process'
import { webSocket, WebSocketSubjectConfig } from 'rxjs/webSocket'
import ws from 'ws'
import {
  COINBASE_EXCHANGE_WEBSOCKET_URL,
  COINBASE_TICKER_PAIRS,
  EXIT_EVENTS,
} from '../constants'

export type Ticker = {
  type: 'ticker'
  sequence: number
  product_id: string
  price: string
  open_24h: string
  volume_24h: string
  low_24h: string
  high_24h: string
  volume_30d: string
  best_bid: string
  best_ask: string
  side: 'buy' | 'sell'
  time: string
  trade_id: number
  last_size: string
}

const subscription = {
  product_ids: COINBASE_TICKER_PAIRS.map((pair) => pair.join('-')),
  channels: ['ticker'],
}

const coinbase$ = webSocket<Ticker>({
  url: COINBASE_EXCHANGE_WEBSOCKET_URL,
  WebSocketCtor: ws,
} as unknown as WebSocketSubjectConfig<Ticker>)

for (const eventType of EXIT_EVENTS)
  process.on(eventType, () => {
    coinbase$.complete()
  })

export const subject = coinbase$.multiplex(
  () => ({ type: 'subscribe', ...subscription }),
  () => ({ type: 'unsubscribe', ...subscription }),
  ({ type }) => subscription.channels.includes(type)
)
