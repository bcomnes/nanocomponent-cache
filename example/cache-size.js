const Nanocomponent = require('nanocomponent')
const html = require('bel')

class CacheSize extends Nanocomponent {
  createElement (size) {
    this.size = size || 0
    return html`
      <div>Cache size: ${this.size}</div>
    `
  }

  update (size) {
    if (this.size !== size) return true
  }
}

module.exports = CacheSize
