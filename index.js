const ClassCache = require('class-cache')

class NanocomponentCache extends ClassCache {
  constructor (opts = {}) {
    // A sane default GC function for nanocomponents
    const { gc = nanocomponent => !nanocomponent.element } = opts
    super({ gc })
  }
}

module.exports = NanocomponentCache
