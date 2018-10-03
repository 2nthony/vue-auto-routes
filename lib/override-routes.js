const globby = require('globby')
const path = require('path')

const formatCode = code =>
  require('prettier')
    .format(code, {
      semi: false,
      parser: 'babylon',
      singleQuote: true
    })

module.exports = ({
  dir,
  exts = ['vue'],
  dynamicImport = false,
  ignore = []
}) => {
  const extensions = exts.map(ext => `**/*.${ext}`)
  const RE = new RegExp(`.(${exts.join('|')})$`)

  let [ _imports, _comps ] = [ '', '' ]

  const routePath = route =>
    '/' +
      route
        .replace(/^\.\//, '')
        .replace(RE, '')
        .replace(/index/, '')

  const routeName = route =>
    route.replace(/\//g, '-').replace(RE, '')

  const routes = globby.sync([
    ...extensions,
    ...ignore
  ], {
    cwd: dir
  }).sort((a, b) => a < b)

  routes.map(route => {
    _imports += dynamicImport
      ? `
        const ${routeName(route)} = () =>
          import(/* webpackChunkName: "${routeName(route)}" */
            '${path.join(dir, route)}'
          )
        `
      : `
        import ${routeName(route)} from '${path.join(dir, route)}'
        `

    _comps += `{
      path: '${routePath(route)}',
      name: '${routeName(route)}',
      component: ${routeName(route)}
    },`
  })

  return formatCode(`
    ${_imports}

    export default [
      ${_comps}
    ]
  `)
}
