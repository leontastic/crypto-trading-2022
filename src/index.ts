import process from 'node:process'
import { webSocket, WebSocketSubjectConfig } from 'rxjs/webSocket'
import ws from 'ws'
import { COINBASE_EXCHANGE_WEBSOCKET_URL, EXIT_EVENTS } from './constants'

const subscription = {
  product_ids: ['ETH-USD'],
  channels: ['ticker'],
}

const coinbase$ = webSocket({
  url: COINBASE_EXCHANGE_WEBSOCKET_URL,
  WebSocketCtor: ws,
  openObserver: {
    next() {
      coinbase$.next({ type: 'subscribe', ...subscription })
    },
  },
  closingObserver: {
    next() {
      coinbase$.next({ type: 'unsubscribe', ...subscription })
    },
  },
} as unknown as WebSocketSubjectConfig<Record<string, unknown>>)

coinbase$.subscribe(console.log)

for (const eventType of EXIT_EVENTS)
  process.on(eventType, () => {
    coinbase$.complete()
  })
