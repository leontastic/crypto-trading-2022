import * as React from 'react'
import * as DOM from 'react-dom'
import App from './app'

const root = document.createElement('root')
document.body.append(root)

DOM.render(<App />, root)
