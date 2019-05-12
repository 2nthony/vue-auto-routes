# vue-auto-routes

> Auto generate vue routes

[![NPM version](https://badgen.net/npm/v/vue-auto-routes)](https://npmjs.com/package/vue-auto-routes)
[![NPM download](https://badgen.net/npm/dm/vue-auto-routes)](https://npmjs.com/package/vue-auto-routes)
[![CircleCI](https://badgen.net/circleci/github/evillt/vue-auto-routes?icon=circleci)](https://circleci.com/gh/evillt/vue-auto-routes/tree/master)
[![License](https://badgen.net/npm/license/vue-auto-routes)](./LICENSE)
[![donate](https://badgen.net/badge/support%20me/donate/f2a)](https://patreon.com/evillt)

## Install

```console
yarn add vue-auto-routes
```

## Usage

We assume your directory looks like this:

```
src
├── views
│   ├── index.vue
│   └── about.vue
└── webpack.config.js
```

Then in your `webpack.config.js`:

```js
const VueAutoRoutes = require('vue-auto-routes/plugin')

module.exports = {
  plugins: [
    new VueAutoRoutes({
      dir: require('path').resolve(__dirname, 'src/views')
    })
  ]
}
```

And in your `router.js`:

```js
import { routes } from 'vue-auto-routes'

export default new VueRouter({ routes })
```

## Files Convertion

```js
// index.vue -> /
// about.vue -> /about
// user.vue -> /user
// user/index.vue -> /user, child ''
// user/friends.vue -> /user, child 'friends'
// catalog/index.vue -> /catalog
// catalog/specials.vue -> /catalog/specials
// _path.vue -> /:path
// {path}.vue -> /:path  props: true
// 404.vue -> *
```

# API

`new VueAutoRoutes(options)`

## options

Since `v1.1.11` options for [@ream/collect-fs-routes v1.0.2](https://github.com/ream/collect-fs-routes#api), but **differences** with these following

### dir

- Type: `string`
- Required: `true`

Routes directory, it should be an _**absolute path**_.

### ~~componentPrefix~~

### match

- Type: `string` `RegExp`
- Default: `'vue'` `/\.vue$/`

It used to match page components.

We use `,` to split match file extension when is a string.

### watchMode

- Type: `boolean`
- Default: `true` in `webpack-dev-server` and `webpack-dev-middleware`, `false` otherwise

Watching pages directory to auto update routes.

### default404

- Type: `boolean`
- Default: `true`

Use internal 404 page for mismatch route. You can create a `404.{#match}` in your `dir` to instead of it or set it `false`.

# Other

[@ream/collect-fs-routes](https://github.com/ream/collect-fs-routes#optionsdir) Offical usage like.

```js
const {
  collectRoutes,
  renderRoutes,
  renderRoutesMap
} = require('vue-auto-routes/lib/collect-fs-routes')

const routes = await collectRoutes(options)
const routesString = renderRoutes(routes)
const routesMap = renderRoutesMap(routes) // Get a fullPath list of each route
```

Options for [options](#options)

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

**vue-auto-routes** © [evillt](https://github.com/evillt), Released under the [MIT](./LICENSE) License.

Authored and maintained by **EVILLT** with help from contributors ([list](https://github.com/evillt/vue-auto-routes/contributors)).

> [evila.me](https://evila.me) · GitHub [@evillt](https://github.com/evillt) · Twitter [@evillt](https://twitter.com/evillt)
