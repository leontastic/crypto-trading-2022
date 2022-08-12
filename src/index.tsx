import * as React from 'react'
import * as DOM from 'react-dom'

const Greet = () => <h1>Hello, world!</h1>

const root = document.createElement('root')
document.body.append(root)

DOM.render(<Greet />, root)
