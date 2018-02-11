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
        ${c.get('button-null').render({disabled: true})}
        ${c.get('button-2').render(props)}
        ${c.get('button-3').render(props)}
        ${c.get('button-4').render(props)}
        ${c.get('button-5', {args: ['button-whatever']}).render(props, 'Button 6')}
        ${c.get('button-6').render(props)}
        ${c.get('button-7').render(props)}
        ${c.get('button-8').render(props)}
        ${c.get('button-9').render(props)}
        ${c.get('button-10').render(props)}
        ${c.get('button-11').render(props)}
        ${c.get('button-12').render(props)}
        ${c.get('button-13').render(props)}
        ${c.get('button-14').render(props)}
        ${c.get('button-15').render(props)}
        ${c.get('button-16').render(props)}
        ${c.get('button-17').render(props)}
        ${c.get('button-18').render(props)}
        ${c.get('button-19').render(props)}
        ${c.get('button-20').render(props)}
        ${c.get('button-21').render(props)}
        ${c.get('button-22').render(props)}
        ${c.get('button-23').render(props)}
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
