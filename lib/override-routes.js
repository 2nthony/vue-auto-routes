const globby = require('globby')
const path = require('path')
const crypto = require('crypto')

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
  const ignorePath = ignore.map(ig => `!${ig}`)
  const RE = new RegExp(`.(${exts.join('|')})$`)

  let [ _imports, _comps ] = [ '', '' ]

  const routePath = route =>
    '/' +
      route
        .replace(/^\.\//, '')
        .replace(RE, '')
        .replace(/\/?index/, '')
        .replace(/_/g, ':') // solve to regular vue dynamic route

  const routeName = route =>
    route.replace(/\//g, '-').replace(RE, '').replace(/_/g, '')

  const routeComp = route =>
    '_' +
      crypto
        .createHmac('sha256', route)
        .digest('hex')
        .slice(0, 6)

  const routes = globby.sync([
    ...extensions,
    ...ignorePath
  ], {
    cwd: dir
  }).sort(a => a.indexOf('_') >= 0) // dynamic route go last

  routes.map(route => {
    _imports += dynamicImport
      ? `
        const ${routeComp(route)} = () =>
          import(/* webpackChunkName: "${routeName(route)}" */
            '${path.join(dir, route)}'
          )
        `
      : `
        import ${routeComp(route)} from '${path.join(dir, route)}'
        `

    _comps += `{
      path: '${routePath(route)}',
      name: '${routeName(route)}',
      component: ${routeComp(route)}
    },`
  })

  return formatCode(`
    ${_imports}

    export default [
      ${_comps}
    ]
  `)
}
