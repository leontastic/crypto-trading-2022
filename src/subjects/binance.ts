import { map } from 'rxjs'
import { webSocket, WebSocketSubjectConfig } from 'rxjs/webSocket'
import {
  BINANCE_EXCHANGE_WEBSOCKET_URL,
  BINANCE_TICKER_PAIRS,
} from '../constants'

type Ticker = {
  stream: string
  data: {
    u: number // UpdateId
    s: string // Symbol
    b: string // Bid price
    B: string // Bid quantity
    a: string // Ask price
    A: string // Ask quantity
  }
}

const subscription = {
  params: BINANCE_TICKER_PAIRS.map(
    (pair) => `${pair.join('').toLowerCase()}@bookTicker`
  ),
}

const binance$ = webSocket({
  url: BINANCE_EXCHANGE_WEBSOCKET_URL,
} as unknown as WebSocketSubjectConfig<Ticker>)

export default binance$
  .multiplex(
    () => ({ method: 'SUBSCRIBE', ...subscription, id: Date.now() }),
    () => ({ method: 'UNSUBSCRIBE', ...subscription, id: Date.now() }),
    ({ stream }) => subscription.params.includes(stream)
  )
  .pipe(map(({ data }) => data))
