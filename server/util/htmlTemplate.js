import React from 'react'
import { renderToString } from 'react-dom/server'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom'
import serialize from 'serialize-javascript'

const getHtmlTemplate = (html, moduleName, preloadedState, propsData) => {
  /* eslint no-undef: "off" */
  const assets = webpackIsomorphicTools.assets()

  // styles
  const vendorStyleHTML = assets.styles.vendor ? `
    <link href="${assets.styles.vendor}" rel="stylesheet" type="text/css" />
  ` : ''

  const moduleStyleHTML = assets.styles[moduleName] ? `
    <link href="${assets.styles[moduleName]}" rel="stylesheet" type="text/css" />
  ` : ''

  // props
  const propsScriptHTML = typeof propsData !== 'undefined' ? `
    <script>
      window.PROPS = ${serialize(propsData)}
    </script>
  ` : ''

  // scripts
  const reduxScriptHTML = typeof preloadedState !== 'undefined' ? `
    <script>
      window.PRELOADED_STATE = ${serialize(preloadedState)}
    </script>
  ` : ''

  const vendorScriptHTML = `
    <script src="${assets.javascript.vendor}"></script>
  `

  const moduleScriptHTML = `
    <script src="${assets.javascript[moduleName]}"></script>
  `

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>${moduleName} Page</title>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
        <link rel="icon" href="/favicon.ico" type="image/x-icon">
        ${vendorStyleHTML}
        ${moduleStyleHTML}
      </head>
      <body>
        <div id="root">${html}</div>
        ${propsScriptHTML}
        ${reduxScriptHTML}
        ${vendorScriptHTML}
        ${moduleScriptHTML}
      </body>
    </html>
  `
}

export const renderPage = (ctx, Module, moduleName, options = {}) => {
  let html
  const reducer = options.reducer
  const propsData = options.propsData
  let preloadedState
  const context = {}

  if (typeof reducer !== 'undefined') {
    const store = createStore(reducer)

    html = renderToString(
      <StaticRouter>
        <Provider store={store}>
          <Module {...propsData} />
        </Provider>
      </StaticRouter>
    )

    preloadedState = store.getState()
  } else {
    html = renderToString(
      <StaticRouter location={ctx.request.url} context={context}>
        <Module {...propsData} />
      </StaticRouter>
    )
  }

  return getHtmlTemplate(html, moduleName, preloadedState, propsData)
}
