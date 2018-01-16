const html = require('choo/html')
const choo = require('choo')
const ButtonZone = require('./button-zone')

const app = choo()
app.use(clickerStore)
app.route('/', mainView)
if (typeof window !== 'undefined') {
  const container = document.createElement('div')
  container.id = 'container'
  document.body.appendChild(container)
  app.mount('#container')
}

const buttonZone = new ButtonZone()

function mainView (state, emit) {
  return html`
    <div id="container">
      <div id="app">
        <h1>Lots and lots of buttons!</h1>
        ${buttonZone.render(state, emit)}
      </div>
    </div>`
}

function clickerStore (state, emitter) {
  state.buttons = {}
  emitter.on('click', function (name) {
    console.log('clicked ' + name)
    if (!isNaN(state.buttons[name])) state.buttons[name]++
    else state.buttons[name] = 1
    console.log(state.buttons)
  })
}
