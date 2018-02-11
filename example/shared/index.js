const html = require('choo/html')
const choo = require('choo')
const NanocomponentCache = require('../../')
const Button = require('../hella-buttons/button')

const app = choo()
app.use(clickerStore)
app.route('/', view1)
app.route('/view2', view2)
if (typeof window !== 'undefined') {
  const container = document.createElement('div')
  container.id = 'container'
  document.body.appendChild(container)
  app.mount('#container')
}

function view1 (state, emit) {
  const c = state.cache
  return html`
    <div id="container">
      <div id="app">
        <h1>Shared cache: view 1</h1>
        ${nav()}
        ${c.get('shared').render({}, 'lol')}
        ${c.get('view1-thing').render({}, 'hey')}
      </div>
    </div>`
}

function view2 (state, emit) {
  const c = state.cache
  return html`
    <div id="container">
      <div id="app">
        <h1>Shared cache: view 2</h1>
        ${nav()}
        ${c.get('shared').render({}, 'lol')}
        ${c.get('view2-thing').render({}, 'bye')}
      </div>
    </div>`
}

function nav () {
  return html`
    <div>
      <a href="/">View 1</a>
      <a href="/view2">View 2</a>
    </div>
  `
}

function clickerStore (state, emitter) {
  state.cache = new NanocomponentCache()
  state.cache.register(Button)
}
