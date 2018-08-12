# vue-auto-routes

> A **hack way** to auto generate vue routes.

# Notice

- ⚡️ Only test on webpack v4.x

# Install

```bash
npm install --save @evila/vue-auto-routes
```

# Usage

```js
// example directory
|- src/
|--- pages/
    |--- foo/
    |   |- index.vue
    |--- _id.vue
    |--- index.vue
|- webpack.config.js

// webpack.config.js
const VueAutoRoutes = require('@evila/vue-auto-routes/lib/plugin')

module.exports = {
  plugins: [
    new VueAutoRoutes({
      pages: require('path').resolve(__dirname, './src/pages')
    })
  ]
}

// router.js
import routes from '@evila/vue-auto-routes'

export default new Router({ routes })

console.log(routes) // Check about it!
```

# Params

`new VueAutoRoutes([options<object>])`

## options

### pages
- Type: `String`
- Required: `true`

Pages directory, recommand to use `path` module

### ignore
- Type: `Array<String>`
- Default: `[]`

Ignore some directory you don't wanna include into routes under `pages` directory

e.g. `['**/src/components']`

### extensions
- Type: `Array<String>`
- Default: `['vue']`

All `.vue` files will auto join `vue-routes` under `pages` directory (same with `['vue', 'js']`)

### importPrefix
- Type: `String`
- Default: `@/pages`

Depend on `config.resolve.alias['@']`

```js
import component from '@/pages/component.vue'
```

### dynamicImport
- Type: `Boolean`
- Default: `false`

If set `true`, please make sure is using `babel` and `babel-plugin-syntax-dynamic-import` in project

```js
const component = () => import('@/pages/component.vue')
```

### webpackChunkName
- Type: `String`
- Default: `''`

Make sure already set `dynamicImport` is `true`

`{ webpackChunkName: 'myRoutes' }`

```js
const component = () => import(/* webpackChunkName: 'myRoutes' */ '@/pages/component.vue')
```