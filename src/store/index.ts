import { configureStore } from '@reduxjs/toolkit'
import tickers from './slices/tickers'

export const store = configureStore({
  reducer: {
    tickers,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type Dispatch = typeof store.dispatch
