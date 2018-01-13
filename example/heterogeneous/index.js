const html = require('choo/html')
const choo = require('choo')
const MixedList = require('./mixed-list')
const shuffleArray = require('fy-shuffle')

const app = choo()
app.use(tweetStore)
app.route('/', mainView)
if (typeof window !== 'undefined') {
  const container = document.createElement('div')
  container.id = 'container'
  document.body.appendChild(container)
  app.mount('#container')
}

const list = new MixedList()

function mainView (state, emit) {
  return html`
    <div id="container">
      <div>
        <button onclick=${ev => emit('shuffle-urls')}>shuffle urls</button>
        <button onclick=${ev => emit('reverse-urls')}>reverse urls</button>
        <button onclick=${ev => emit('add-url')}>add url</button>
        <button onclick=${ev => emit('append-url')}>append url</button>
        <button onclick=${ev => emit('pop-url')}>pop url</button>
        <button onclick=${ev => emit('shift-url')}>shift url</button>
        <button onclick=${ev => emit('re-render')}>plain render</button>
        <span>Cache Size: ${Object.keys(list.nc._cache).length}</span>
      </div>
      <div id="app">
        <h1>Embed some stuff with Choo</h1>
        ${list.render(state.tweets)}
      </div>
    </div>`
}

const moreTweets = [
  'https://twitter.com/uhhyeahbret/status/898315707254841344',
  'https://www.youtube.com/watch?v=b8HO6hba9ZE',
  'https://twitter.com/uhhyeahbret/status/898214560267608064',
  'https://vimeo.com/229754542',
  'https://twitter.com/uhhyeahbret/status/898196092189253632',
  'https://www.youtube.com/watch?v=bYpKrA233vY'
]

function tweetStore (state, emitter) {
  state.tweets = [
    'https://www.youtube.com/watch?v=wGCoAFZiYMw',
    'https://twitter.com/uhhyeahbret/status/897603426518876161',
    'https://twitter.com/yoshuawuyts/status/895338700531535878'
  ]

  emitter.on('DOMContentLoaded', function () {
    emitter.on('shuffle-urls', function () {
      state.tweets = shuffleArray(state.tweets)
      emitter.emit('render')
    })
    emitter.on('reverse-urls', function () {
      state.tweets = state.tweets.reverse()
      emitter.emit('render')
    })
    emitter.on('add-url', function () {
      const a = moreTweets.pop()
      if (a) {
        state.tweets.unshift(a)
        emitter.emit('render')
      }
    })
    emitter.on('append-url', function () {
      const a = moreTweets.pop()
      if (a) {
        state.tweets.push(a)
        emitter.emit('render')
      }
    })
    emitter.on('pop-url', function () {
      const a = state.tweets.pop()
      if (a) {
        moreTweets.push(a)
        emitter.emit('render')
      }
    })
    emitter.on('shift-url', function () {
      const a = state.tweets.shift()
      console.log(a)
      if (a) {
        moreTweets.push(a)
        emitter.emit('render')
      }
    })
    emitter.on('re-render', function () {
      emitter.emit('render')
    })
  })
}
