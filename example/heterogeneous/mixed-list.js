const Tweet = require('twitter-component')
const YoutubeComponent = require('youtube-component')
const Nanocomponent = require('nanocomponent')
const assert = require('assert')
const html = require('bel')
const compare = require('nanocomponent/compare')
const NanocomponentCache = require('../../')
const isArray = Array.isArray
const CacheSize = require('../cache-size')

const youtubeOpts = {
  attr: {
    width: 480,
    height: 270
  }
}

class MixedList extends Nanocomponent {
  constructor () {
    super()

    this.urls = null
    this.nc = new NanocomponentCache()
    this.size = new CacheSize()
    this.nc.register({
      'youtube-component': {
        class: YoutubeComponent,
        args: [youtubeOpts]
      },
      'twitter-component': Tweet
    })

    this.componentMap = this.componentMap.bind(this)
  }

  componentMap (url, i, list) {
    switch (true) {
      case /^https?:\/\/(www\.)?youtu\.be/i.test(url):
      case /^https?:\/\/(www\.)?youtube\.com/i.test(url):
      case /^https?:\/\/(www\.)?vimeo\.com/i.test(url):
      case /^https?:\/\/(www\.)?dailymotion\.com/i.test(url): {
        return this.nc.get(url, 'youtube-component').render(url)
      }
      case /^https?:\/\/(www\.)?twitter.com\/.*\/status\/\d*$/i.test(url): {
        return this.nc.get(url, 'twitter-component').render(url)
      }
      default: {
        return html`<div>Unknown URL type: ${url}</div>`
      }
    }
  }

  createElement (urls) {
    assert(isArray(urls), 'MixedList: urls must be an array of tweet URLs')
    this.urls = urls.slice() // Have to slice since urls is an array
    const stream = urls.map(this.componentMap) // make sure the cache is warm before we inspect it in this example
    return html`
      <div>
        ${this.size.render(Object.keys(this.nc._cache).length)}
        ${stream}
      </div>
    `
  }

  update (urls) {
    assert(isArray(urls), 'tweetList must be an array of tweet URLs')
    return compare(this.urls, urls)
  }

  afterupdate (el) {
    this.nc.gc()
    this.size.render(Object.keys(this.nc._cache).length)
  }
}

module.exports = MixedList
