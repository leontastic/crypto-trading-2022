import { webSocket, WebSocketSubjectConfig } from 'rxjs/webSocket'
import {
  COINBASE_EXCHANGE_WEBSOCKET_URL,
  COINBASE_TICKER_PAIRS,
} from '../constants'

type Ticker = {
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
} as unknown as WebSocketSubjectConfig<Ticker>)

export default coinbase$.multiplex(
  () => ({ type: 'subscribe', ...subscription }),
  () => ({ type: 'unsubscribe', ...subscription }),
  ({ type }) => subscription.channels.includes(type)
)
