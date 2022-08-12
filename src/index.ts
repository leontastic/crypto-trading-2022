import { set } from 'lodash'
import { filter, scan, throttleTime } from 'rxjs'
import { subject as coinbase } from './subjects/coinbase'

coinbase
  .pipe(
    filter(
      ({ product_id }) =>
        product_id.startsWith('ETH-') || product_id.endsWith('-ETH')
    ),
    scan(
      (tickers, { product_id, price, best_bid, best_ask, time, last_size }) =>
        set(tickers, product_id, {
          price,
          best_bid,
          best_ask,
          time,
          last_size,
        }),
      {}
    ),
    throttleTime(100)
  )
  .subscribe((tickers) => {
    console.clear()
    console.log(new Date().toISOString())
    console.table(tickers)
  })
