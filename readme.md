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

example directory

```js
// index.vue -> /
// about.vue -> /about
// user.vue -> /user
// user/index.vue -> /user, child ''
// user/friends.vue -> /user, child 'friends'
// catalog/index.vue -> /catalog
// catalog/specials.vue -> /catalog/specials
// _path.vue -> /:path
```

webpack.config.js

```js
const VueAutoRoutes = require('vue-auto-routes/lib/plugin')

module.exports = {
  plugins: [
    new VueAutoRoutes({
      pagesDir: require('path').resolve(__dirname, 'pages')
    })
  ]
}
```

router.js

```js
import { routes } from 'vue-auto-routes'

export default new Router({ routes })
```

# API

`new VueAutoRoutes([options<object>])`

## options
Since `v1.1.11` options for [@ream/collect-fs-routes v1.0.2](https://github.com/ream/collect-fs-routes#optionspagesdir), but **differences** with these following

### pagesDir
- Type: `string`
- Required: `true`

Pages directory, it should be an _**absolute path**_.

### ~~componentPrefix~~

### match
- Type: `string` `RegExp`
- Default: `'vue'` `/\.vue$/`

It used to match page components.

### routesMap
- Type: `boolean`
- Default: `false`

Get a fullPath list of each route.

```js
import { routesMap } from 'vue-auto-routes'

[
  '/',
  '/about',
  '/foo/takemehome',
  ...
]
```

# Other
[@ream/collect-fs-routes](https://github.com/ream/collect-fs-routes#optionspagesdir) Offical usage like.

```js
const { collectRoutes, renderRoutes, renderRoutesMap } = require('vue-auto-routes/lib/collect-fs-routes')

const routes = await collectRoutes(options)
const routesString = renderRoutes(routes)
const routesMap = renderRoutesMap(routes)
```

Options for [options](#options)

# License
MIT