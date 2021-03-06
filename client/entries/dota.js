import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { BrowserRouter } from 'react-router-dom'
import Dota from '../pages/dota/home'

const props = window.PROPS

delete window.PROPS

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <BrowserRouter>
        <Component {...props} />
      </BrowserRouter>
    </AppContainer>,
    document.getElementById('root')
  )
}

render(Dota)

if (module.hot) {
  module.hot.accept('../pages/dota/home', () => { render(Dota) })
}
