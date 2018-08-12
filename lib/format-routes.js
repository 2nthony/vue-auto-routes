const fg = require('fast-glob')
const crypto = require('crypto')
const prettier = require('prettier')

const hmac = str => crypto.createHmac('sha256', str).digest('hex')

const format = str => prettier.format(str, {
  semi: false,
  parser: 'babylon',
  singleQuote: true
})

module.exports = function ({
  pages,
  webpackChunkName = '',
  dynamicImport = false,
  importPrefix = '@/pages',
  extensions = ['vue'],
  ignore = []
}) {
  return new Promise(resolve => {
    let imports = ''
    let routes = ''

    const fileRegExp = new RegExp(`.(${extensions.join('|')})$`)

    const files = fg.sync(
      extensions.map(type => `**/*.${type.trim()}`),
      {
        cwd: pages,
        onlyFiles: true,
        ignore
      }
    ).sort((a, b) => a < b)

    files.forEach(file => {
      const filename = file.replace(fileRegExp, '')
      const component = '_' + hmac(file).slice(0, 7)

      imports += dynamicImport
        ? `
          const ${component} = () => import(
            ${webpackChunkName ? `/* webpackChunkName: '${webpackChunkName}' */` : ''}
            '${importPrefix}/${file}'
          )
        `
        : `
          import ${component} from '${importPrefix}/${file}'
        `

      routes += `
        {
          path: '/${filename.replace(/\/?index/, '').replace(/_/g, ':')}',
          name: '${filename.replace(/_/g, '').replace(/\//g, '-')}',
          component: ${component},
        },
      `
    })

    resolve(format(`
      ${imports}

      export default [
        ${routes}
      ]

    `))
  })
}
