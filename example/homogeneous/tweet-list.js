const Tweet = require('twitter-component')
const Nanocomponent = require('nanocomponent')
const assert = require('assert')
const html = require('bel')
const compare = require('nanocomponent/compare')
const NanocomponentCache = require('../../')
const isArray = Array.isArray
const CacheSize = require('../cache-size')

class TweetList extends Nanocomponent {
  constructor () {
    super()
    window.list = this
    this.tweetList = null
    this.size = new CacheSize()
    this.nc = new NanocomponentCache()
    this.nc.register(Tweet, [{ placeholder: false }])
  }

  createElement (tweetList) {
    assert(isArray(tweetList), 'tweetList must be an array of tweet URLs')
    this.tweetList = tweetList.slice() // Have to slice since tweetList is an array
    const nc = this.nc
    const tweets = tweetList.map(tweetURL => nc.get(tweetURL).render(tweetURL))
    return html`
      <div>
        ${this.size.render(Object.keys(this.nc._cache).length)}
        ${tweets}
      </div>
    `
  }

  update (tweetList) {
    assert(isArray(tweetList), 'tweetList must be an array of tweet URLs')
    return compare(this.tweetList, tweetList)
  }

  afterupdate (el) {
    this.nc.gc()
    this.size.render(Object.keys(this.nc._cache).length)
  }
}

module.exports = TweetList
