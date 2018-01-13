const html = require('choo/html')
const choo = require('choo')
const TweetList = require('./tweet-list')
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

const list = new TweetList()

function mainView (state, emit) {
  return html`
    <div id="container">
      <div>
        <button onclick=${ev => emit('shuffle-tweets')}>shuffle tweets</button>
        <button onclick=${ev => emit('reverse-tweets')}>reverse tweets</button>
        <button onclick=${ev => emit('add-tweet')}>add tweet</button>
        <button onclick=${ev => emit('append-tweet')}>append tweet</button>
        <button onclick=${ev => emit('pop-tweet')}>pop tweet</button>
        <button onclick=${ev => emit('shift-tweet')}>shift tweet</button>
        <button onclick=${ev => emit('re-render')}>plain render</button>
      </div>
      <div id="app">
        <h1>Embed some tweets in Choo</h1>
        ${list.render(state.tweets)}
      </div>
    </div>`
}

const moreTweets = [
  'https://twitter.com/uhhyeahbret/status/898315707254841344',
  'https://twitter.com/uhhyeahbret/status/898214560267608064',
  'https://twitter.com/uhhyeahbret/status/898196092189253632'
]

function tweetStore (state, emitter) {
  state.tweets = [
    'https://twitter.com/uhhyeahbret/status/897603426518876161',
    'https://twitter.com/yoshuawuyts/status/895338700531535878'
  ]

  emitter.on('DOMContentLoaded', function () {
    emitter.on('shuffle-tweets', function () {
      state.tweets = shuffleArray(state.tweets)
      emitter.emit('render')
    })
    emitter.on('reverse-tweets', function () {
      state.tweets = state.tweets.reverse()
      emitter.emit('render')
    })
    emitter.on('add-tweet', function () {
      const a = moreTweets.pop()
      if (a) {
        state.tweets.unshift(a)
        emitter.emit('render')
      }
    })
    emitter.on('append-tweet', function () {
      const a = moreTweets.pop()
      if (a) {
        state.tweets.push(a)
        emitter.emit('render')
      }
    })
    emitter.on('pop-tweet', function () {
      const a = state.tweets.pop()
      if (a) {
        moreTweets.push(a)
        emitter.emit('render')
      }
    })
    emitter.on('shift-tweet', function () {
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
