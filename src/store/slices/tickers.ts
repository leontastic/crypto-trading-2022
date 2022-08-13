import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import type { Ticker } from '../../subjects/tickers'

export const adapter = createEntityAdapter<Ticker>({
  selectId: (ticker) => `${ticker.exchange}:${ticker.symbol}`,
  sortComparer: (a, b) => a.symbol.localeCompare(b.symbol),
})

export const slice = createSlice({
  name: 'tickers',
  initialState: adapter.getInitialState(),
  reducers: {
    setTicker: adapter.setOne,
  },
})

export const { setTicker } = slice.actions

export default slice.reducer
