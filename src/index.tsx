import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { animationFrames, buffer } from 'rxjs'
import App from './app'
import { store } from './store'
import { setTickers } from './store/slices/tickers'
import tickers from './subjects/tickers'
import './index.css'
import fonts from './utils/fonts'

const main = async () => {
  const container = document.createElement('div')
  container.id = 'root'
  document.body.append(container)

  await fonts

  createRoot(container).render(
    <Provider store={store}>
      <App />
    </Provider>
  )

  tickers.pipe(buffer(animationFrames())).subscribe({
    next(tickers) {
      store.dispatch(setTickers(tickers))
    },
    error: console.error,
  })
}

main().catch(console.error)
