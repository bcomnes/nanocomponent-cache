const ClassCache = require('class-cache')

class NanocomponentCache extends ClassCache {
  constructor (opts = {}) {
    const { gc = nanocomponent => nanocomponent.element } = opts
    super({ gc })
  }
}

module.exports = NanocomponentCache
