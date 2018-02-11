const html = require('bel')
const Nanocomponent = require('nanocomponent')
const compare = require('nanocomponent/compare')

let buttonCounter = 0

class Button extends Nanocomponent {
  constructor (name) {
    super()
    this.name = name || 'button-' + buttonCounter++
  }

  createElement (props, children) {
    var { className, disabled, onclick } = props

    this.args = [className, disabled, onclick, children]

    return html`
    <button class="${className || ''}"
      disabled=${disabled || false}
      data-name=${this.name}
      onclick=${onclick || null}>
      ${children || this.name}
    </button>
    `
  }

  update (props, children) {
    var { className, disabled, onclick } = props
    return compare(this.args, [className, disabled, onclick, children])
  }
}

module.exports = Button
