# vue-auto-routes

> A **hack way** to auto generate vue routes.

[![NPM version](https://flat.badgen.net/npm/v/vue-auto-routes?icon=npm)](https://npmjs.com/package/vue-auto-routes)
![NPM downloads](https://flat.badgen.net/npm/dt/vue-auto-routes?icon=npm)
![License](https://flat.badgen.net/npm/license/vue-auto-routes)

# Install

```bash
yarn add vue-auto-routes
# prefer npm
npm i vue-auto-routes -S
```

# Usage

Example directory

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
```

See [https://router.vuejs.org/guide/essentials/passing-props.html#boolean-mode](https://router.vuejs.org/guide/essentials/passing-props.html#boolean-mode)

But SHOULD NOT create two or more same route files.

webpack.config.js

```js
const VueAutoRoutes = require('vue-auto-routes/lib/plugin')

module.exports = {
  plugins: [
    new VueAutoRoutes({
      pagesDir: require('path').resolve(__dirname, 'src/pages')
    })
  ]
}
```

router.js

```js
import { routes } from 'vue-auto-routes'

export default new VueRouter({ routes })
```

# API

`new VueAutoRoutes(options: object)`

## options
Since `v1.1.11` options for [@ream/collect-fs-routes v1.0.2](https://github.com/ream/collect-fs-routes#api), but **differences** with these following

### pagesDir
- Type: `string`
- Required: `true`

Pages directory, it should be an _**absolute path**_.

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

Use internal 404 page for mismatch route. You can create a `404.{#match}` in your `pagesDir` to instead of it or set it `false`.

# Other
[@ream/collect-fs-routes](https://github.com/ream/collect-fs-routes#optionspagesdir) Offical usage like.

```js
const { collectRoutes, renderRoutes, renderRoutesMap } = require('vue-auto-routes/lib/collect-fs-routes')

const routes = await collectRoutes(options)
const routesString = renderRoutes(routes)
const routesMap = renderRoutesMap(routes) // Get a fullPath list of each route
```

Options for [options](#options)

# License
MIT
