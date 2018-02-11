# NanocomponentCache [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5]
[![downloads][8]][9] [![js-standard-style][10]][11]

Cache a nanocomponent instance by key.  Creates a new instance if the key doesn't exist, otherwise returns the cached instance.  A subclass of [class-cache][cc] providing sane GC function defaults and a set of examples of intended usage.  Optional LRU caching.

## Usage

```js
const NanocomponentCache = require('nanocomponent-cache')
const compare = require('nanocomponent/compare')
const Nanocomponent = require('nanocomponent')
const Tweet = require('twitter-component')
const assert = require('assert')
const html = require('bel')

class TweetList extends Nanocomponent {
  constructor () {
    super()
    this.tweetList = null
    // auto-eject last used instances over 100 total cached
    this.nc = new NanocomponentCache({ lru: 100 })
    // Register the components you will be caching
    this.nc.register(Tweet, {args: [{ placeholder: false }]} )
  }

  createElement (tweetList) {
    assert(isArray(tweetList), 'tweetList must be an array of tweet URLs')
    this.tweetList = tweetList // Cache a reference to tweetList
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

  afterupdate (el) {
    // Periodically run the GC function to clean up unused instances.
    this.nc.gc()
  }
}

module.exports = TweetList
```

## Examples

- [homogeneous](examples/homogeneous)
- [heterogeneous](examples/heterogeneous)
- [hella-buttons](examples/hella-buttons)
- [shared](examples/shared)

## Installation
```sh
$ npm install nanocomponent-cache
```
## API
### `NanocomponentCache = require('nanocomponent-cache`)
Require `NanocomponentCache` class.

### `c = new NanocomponentCache([opts])`
Create a new cache instance.

`opts` include:

```js
{
  gc: (component) => !component.element // a default garbage collection function
  args: [] // Default args used for instantiating all classes,
  lru: 0 // Enable LRU gc by setting this to an integer greater than 0
}
```

### `c.register([typeKey = 'default'], SomeNanocomponent, [opts])`

Define a `Class` for the optional `typeKey`.  The default `typeKey` is `default`, which is used whenever a `typeKey` is omitted during `get`s and `set`s.  `opts` include: 

```js
{
  gc: undefined // a typeKey specific GC function.
  args: undefined // default arguments instance arguments for `typeKey`. 
  // These options delegate to the top level options if left un-implemented
}
```

This is a shortcut for defining with a typeObject:

```js
c.register({
  typeKey: { class: SomeNanocomponent, ...opts }
})
```

### `c.register({ typeObject })`

Define class 'type's using a `typeObject` definition.  A typeObject is an object who's keys define the type name which are associated with a `Class` and optionally `args` and a type specific `gc` function.

```js
c.register({
  default: SomeNanocomponent, // SomeNanocomponent with no args or gc.  Uses instance gc function.
  baz: { class: SomeNanocomponent, ...opts }
})
```

Types are `Object.assign`ed over previously registered types.  The `opts` keys are the same as above.

### `c.unregister(...types)`

Pass typeKeys as arguments to un-register them.  Instances are untouched during this process. 

### `c.get(key, [Class || typeKey], [opts])`

The primary method used to retrieve and create instances.  Return instance of `Class` or defined `type` class at `key`.  If an instance does not yet exist at `key`, it will be instantiated with `args` along with a `key` specific `gc` function.  If `type` is not defined, this method will throw.

Omitting optional method arguments delegates to the next most specific option. 

```js
c.get('some-key') // Return or create the 'default' Class
c.get('some-key', {args: ['arg0', 'arg2']})
c.get('some-key', null, {args: ['arg0', 'arg2']}) // Return the default registered class with specific args
c.get('some-key', 'some-type', { args: ['arg0', 'arg2'] }) // Return the `some-type` class at `some-key`.
c.get('some-key', SomeOtherNanocomponent, { args: ['arg0', 'arg2'], gc: instance => true })
```

If `key` is already instantiated, `args` is ignored.  Pass changing properties as subsequent calls to the returned instance.  If `type` or `Class` changes, the `key` instance is re-instantiated.

### `c.set(key, [Class || type], [opts])`

Force instantiate the class instance at `key`.  Follows the same override behavior as `get`.  If you must change `args` on a key, this is the safest way to do that.

Returns the newly created instance.

### `c.gc()`

Run the various `gc` functions defined.  For each key, only the most specific `gc` function set is run.  Return `true` from the `gc` functions to garbage collect that instance, and `false` to preserve.

This is used to clean out instances you no longer need.  Because this iterates over all keys with instances, run this often enough so that the key set doesn't grow too large but not too often to create unnecessary delays in render loops.

### `c.clear()`

Clear all `key` instances.  The `gc` functions for each instance will be run receiving the following signature: `(instance, key, true) => {}`.  If your instance needs to let go of resources, watch for the second argument to equal true, indicating tht the instance will be deleted.  

### `c.delete(key)`

Delete specific `key` instance.  Will run the `gc` function passing `true` as the second argument (`(instance, key, true) => {}`).

### `c.has(key)`

Return true if `key` exists. 

See examples for more details.

## Examples

See the `examples` folder for various ideas on how to use this library.

## See Also

- [nanocomponent][nc]
- [choo][choo]
- [choo component thread](https://github.com/choojs/choo/issues/593#issuecomment-364555843)
- [class-cache](https://github.com/bcomnes/class-cache)

## License
[MIT](https://tldrlegal.com/license/mit-license)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/nanocomponent-cache.svg?style=flat-square
[3]: https://npmjs.org/package/nanocomponent-cache
[4]: https://img.shields.io/travis/bcomnes/nanocomponent-cache/master.svg?style=flat-square
[5]: https://travis-ci.org/bcomnes/nanocomponent-cache
[8]: http://img.shields.io/npm/dm/nanocomponent-cache.svg?style=flat-square
[9]: https://npmjs.org/package/nanocomponent-cache
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
[bel]: https://github.com/shama/bel
[yoyoify]: https://github.com/shama/yo-yoify
[md]: https://github.com/patrick-steele-idem/morphdom
[210]: https://github.com/patrick-steele-idem/morphdom/pull/81
[nm]: https://github.com/yoshuawuyts/nanomorph
[ce]: https://github.com/yoshuawuyts/cache-element
[class]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
[isSameNode]: https://github.com/choojs/nanomorph#caching-dom-elements
[onload]: https://github.com/shama/on-load
[choo]: https://github.com/choojs/choo
[nca]: https://github.com/choojs/nanocomponent-adapters
[nc]: https://github.com/choojs/nanocomponent
[cc]: https://github.com/bcomnes/class-cache
