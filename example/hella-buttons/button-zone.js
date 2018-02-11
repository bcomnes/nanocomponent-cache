const Nanocomponent = require('nanocomponent')
const NanocomponentCache = require('../../')
const Button = require('./button')
const html = require('bel')

class ButtonZone extends Nanocomponent {
  constructor () {
    super()
    this.handleClick = this.handleClick.bind(this)
    this.c = new NanocomponentCache()
    this.c.register(Button)
  }

  createElement (state, emit) {
    this.emit = emit
    const c = this.c
    const props = { onclick: this.handleClick }

    return html`
      <div>
        ${c.get('button-0').render(props)}
        ${c.get('button-1').render(props, 'Button foo')}
        ${c.get('button-2').render({disabled: true})}
        ${c.get('button-3').render(props)}
        ${c.get('button-4').render(props)}
        ${c.get('button-5').render(props)}
        ${c.get('button-6', {args: ['button-whatever']}).render(props, 'Button 6')}
      </div>
    `
  }

  update (state, emit) {
    return true
  }

  handleClick (ev) {
    this.emit('click', ev.currentTarget.dataset.name)
  }
}

module.exports = ButtonZone
