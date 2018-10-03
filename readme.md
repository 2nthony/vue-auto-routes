# vue-auto-routes

> A **hack way** to auto generate vue routes.

# Install

```bash
yarn add vue-auto-routes
# prefer npm
npm i -S vue-auto-routes
```

# Usage

example directory

```bash
.
│── src
│── pages
│   │── foo
│   │   └── index.vue
│   │── _id.vue       # dynamicRoute, same with folder
│   └── index.vue
└── webpack.config.js
```

webpack.config.js

```js
const VueAutoRoutes = require('vue-auto-routes/lib/plugin')

module.exports = {
  plugins: [
    new VueAutoRoutes({
      dir: require('path').resolve(__dirname, 'src/pages')
    })
  ]
}
```

router.js

```js
import routes from 'vue-auto-routes'

export default new Router({ routes })
```

# Params

`new VueAutoRoutes([options<object>])`

## options

### dir
- Type: `String`
- Required: `true`

Pages directory, recommand to use `path` module

### ignore
- Type: `Array<String>`
- Default: `[]`

Ignore some directory you don't wanna include into routes under [dir](#dir)

e.g. `['**/src']`

### exts
- Type: `Array<String>`
- Default: `['vue']`

All `.vue` files will auto join `vue-routes` under `pages` directory (same with `['vue', 'js']`)

### dynamicImport
- Type: `Boolean`
- Default: `false`

If set `true`, please make sure is using `babel` and `babel-plugin-syntax-dynamic-import` in project