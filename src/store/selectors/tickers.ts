import { RootState } from '..'
import { adapter as tickers } from '../slices/tickers'

export const { selectIds, selectEntities, selectAll, selectTotal, selectById } =
  tickers.getSelectors<RootState>((state) => state.tickers)
