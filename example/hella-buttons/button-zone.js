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
    const opts = { onclick: this.handleClick }

    return html`
      <div>
        ${c.get('button-1').render(opts, 'Button 1')}
        ${c.get('button-2').render(opts, 'Button 2')}
        ${c.get('button-3').render(Object.assign({}, opts, {disabled: true}), 'Button 3')}
        ${c.get('button-4').render(opts, 'Button 4')}
        ${c.get('button-5').render(opts, 'Button 5')}
        ${c.get('button-6').render(opts, 'Button 6')}
        ${c.get('button-6', {args: ['button-whatever']}).render(opts, 'Button 6')}
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
