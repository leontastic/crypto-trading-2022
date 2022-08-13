import { Binance, Coinbase } from '@icons-pack/react-simple-icons'
import React, { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './index.css'
import { formatDistance } from 'date-fns'
import BigNumber from 'bignumber.js'
import Flex from '../Flex'
import { selectById } from '../../../store/selectors/tickers'
import { RootState } from '../../../store'
import { Ticker as TickerData } from '../../../types'

BigNumber.config({ DECIMAL_PLACES: 20 })

const Ticker: FC<{ id: number | string }> = ({ id }) => {
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCounter(counter + 1)
    }, 1000)
    return () => {
      clearTimeout(timeout)
    }
  }, [counter])

  const ticker = useSelector<RootState, TickerData | undefined>((state) =>
    selectById(state, id)
  )

  if (ticker === undefined) return null
  return (
    <div className="ticker-card">
      <Flex justify="space-between">
        <pre style={{ fontSize: '1.5rem' }}>{ticker.symbol}</pre>
        {ticker.exchange === 'binance' ? (
          <Binance color="#F0B90B" size="1.5rem" />
        ) : null}
        {ticker.exchange === 'coinbase' ? (
          <Coinbase color="#0052FF" size="1.5rem" />
        ) : null}
      </Flex>
      <br />
      <Flex direction="column" align="end">
        <div style={{ color: 'green' }}>
          <pre>Bid {ticker.bid}</pre>
        </div>
        <div style={{ color: 'red' }}>
          <pre>Ask {ticker.ask}</pre>
        </div>
        <div style={{ color: 'grey' }}>
          <pre>
            Spread{' '}
            {new BigNumber(ticker.ask)
              .minus(new BigNumber(ticker.bid))
              .dividedBy(
                new BigNumber(ticker.ask)
                  .minus(new BigNumber(ticker.bid))
                  .dividedBy(2)
                  .plus(new BigNumber(ticker.ask))
              )
              .times(10_000)
              .toFixed(4)}
            bps
          </pre>
        </div>
      </Flex>
      <br />
      <pre>{ticker.time}</pre>
      <pre>
        {formatDistance(new Date(ticker.time), new Date(), { addSuffix: true })}
      </pre>
    </div>
  )
}

export default Ticker
