var Tweet = require('twitter-component')
var Nanocomponent = require('nanocomponent')
var assert = require('assert')
var html = require('bel')
var compare = require('nanocomponent/compare')
var NanocomponentCache = require('../../')
var isArray = Array.isArray

class TweetList extends Nanocomponent {
  constructor () {
    super()

    this.tweetList = null
    this.nc = new NanocomponentCache()
    this.nc.register(Tweet, [{ placeholder: false }])
  }

  createElement (tweetList) {
    assert(isArray(tweetList), 'tweetList must be an array of tweet URLs')
    this.tweetList = tweetList.slice() // Have to slice since tweetList is an array
    const nc = this.nc
    return html`
      <div>
        ${tweetList.map(tweetURL => nc.get(tweetURL).render(tweetURL))}
      </div>
    `
  }

  update (tweetList) {
    assert(isArray(tweetList), 'tweetList must be an array of tweet URLs')
    return compare(this.tweetList, tweetList)
  }
}

module.exports = TweetList
