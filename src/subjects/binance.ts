import process from 'node:process'
import { map } from 'rxjs'
import { webSocket, WebSocketSubjectConfig } from 'rxjs/webSocket'
import ws from 'ws'
import {
  BINANCE_EXCHANGE_WEBSOCKET_URL,
  BINANCE_TICKER_PAIRS,
  EXIT_EVENTS,
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
  WebSocketCtor: ws,
} as unknown as WebSocketSubjectConfig<Ticker>)

for (const eventType of EXIT_EVENTS)
  process.on(eventType, () => {
    binance$.complete()
  })

export const subject = binance$
  .multiplex(
    () => ({ method: 'SUBSCRIBE', ...subscription, id: Date.now() }),
    () => ({ method: 'UNSUBSCRIBE', ...subscription, id: Date.now() }),
    ({ stream }) => subscription.params.includes(stream)
  )
  .pipe(map(({ data }) => data))
