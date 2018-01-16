var test = require('tape')
var YoutubeComponent = require('youtube-component')
var TwitterComponent = require('twitter-component')
var NanocomponentCache = require('./')

function makeID () {
  return 'testid-' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
}

function createTestElement () {
  var testRoot = document.createElement('div')
  testRoot.id = makeID()
  document.body.appendChild(testRoot)
  return testRoot
}

test('simple mapper', function (t) {
  var testRoot = createTestElement()
  var c = new NanocomponentCache()
  c.register(YoutubeComponent)
  var videos = [
    'https://www.youtube.com/watch?v=b8HO6hba9ZE',
    'https://vimeo.com/229754542',
    'https://www.youtube.com/watch?v=bYpKrA233vY'
  ]

  function renderAndMount (testEl, data, c) {
    var els = data.map(val => c.get('val').render(val))
    els.forEach(function (el) {
      testEl.appendChild(el)
    })
  }

  t.doesNotThrow(renderAndMount.bind(null, testRoot, videos, c), 'Able to render list of videos')
  t.true(testRoot.children[0].children[0].src.includes('youtube.com/embed/b8HO6hba9ZE'), 'videos are in page')
  t.end()
})

test('mixed mapper', function (t) {
  var testRoot = createTestElement()
  var c = new NanocomponentCache()
  c.register('video', YoutubeComponent)
  c.register('tweet', TwitterComponent)
  c.register('default', TwitterComponent)

  var videos = [
    'https://www.youtube.com/watch?v=b8HO6hba9ZE',
    'https://vimeo.com/229754542',
    'https://www.youtube.com/watch?v=bYpKrA233vY'
  ].map(function (url) {
    return { url: url, type: 'video' }
  })

  var tweets = [
    'https://twitter.com/uhhyeahbret/status/897603426518876161',
    'https://twitter.com/yoshuawuyts/status/895338700531535878'
  ].map(function (url) {
    return { url: url, type: 'tweet' }
  })

  delete tweets[0].type  // test the default type

  var data = videos.concat(tweets)

  function renderAndMount (testEl, data, c) {
    var els = data.map(({url, type}) => c.get('url', type).render(url))
    els.forEach(function (el) {
      testEl.appendChild(el)
    })
  }

  t.doesNotThrow(renderAndMount.bind(null, testRoot, data, c), 'Able to render list of videos')
  t.true(testRoot.children[0].children[0].src.includes('youtube.com/embed/b8HO6hba9ZE'), 'videos are in page')
  t.end()
})

test('gc function', function (t) {
  var testRoot = createTestElement()
  var c = new NanocomponentCache()
  c.register(YoutubeComponent)
  var videos = [
    'https://www.youtube.com/watch?v=b8HO6hba9ZE',
    'https://vimeo.com/229754542',
    'https://www.youtube.com/watch?v=bYpKrA233vY'
  ]

  videos.map(url => c.get(url).render(url)).forEach(node => {
    testRoot.appendChild(node)
  })

  videos.map(url => c.get(url).render(url)).forEach((node, i) => {
    t.ok(node.isSameNode(testRoot.childNodes[i]), 'proxy nodes are generated and the same')
  })

  t.equal(Object.keys(c._cache).length, 3, 'cache has 3 nodes in it')

  testRoot.removeChild(testRoot.childNodes[0])
  c.gc()

  t.equal(Object.keys(c._cache).length, 2, 'gc purges unmounted components')
  t.end()
})
