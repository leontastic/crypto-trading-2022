import React from 'react'
import { useSelector } from 'react-redux'
import { selectIds } from '../store/selectors/tickers'
import Flex from './components/Flex'
import TickerCard from './components/Ticker'
import './index.css'

const App = () => {
  const ids = useSelector(selectIds)

  return (
    <div id="app">
      <Flex wrap="wrap">
        {ids.map((id) => (
          <TickerCard key={id} id={id} />
        ))}
      </Flex>
    </div>
  )
}

export default App
