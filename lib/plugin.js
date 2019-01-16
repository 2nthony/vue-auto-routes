const path = require('path')
const { writeFile, watch } = require('fs')
const { promisify } = require('util')
const { collectRoutes, renderRoutes } = require('./collect-fs-routes')

const write = promisify(writeFile)

const pluginName = 'vue-auto-routes'

module.exports = class VueAutoRoutes {
  constructor(options) {
    this.options = Object.assign(
      {
        watchMode: false,
        default404: true
      },
      options
    )

    if (!options.pagesDir) throw new Error('`pagesDir` is required!')

    this.watchMode = this.options.watchMode
    this.default404 = this.options.default404
    delete this.options.watchMode
    delete this.options.default404
  }

  apply(compiler) {
    const writeRoutesFile = async () => {
      const routes = await collectRoutes(this.options)

      if (this.default404 && !routes.find(({ path }) => path === '/404')) {
        routes.push({
          path: '*',
          component: path.resolve(__dirname, '../404.vue')
        })
      }

      await write(
        path.resolve(__dirname, '../index.js'),
        `export const routes = ${renderRoutes(routes, {
          pagesDir: this.options.pagesDir
        })}
        `
      )
    }

    const fn = c => {
      const watchMode = this.watchMode || c.watchMode

      if (watchMode) {
        const watcher = watch(this.options.pagesDir, { recursive: true })
        watcher.on('change', writeRoutesFile)
      }
    }

    writeRoutesFile()

    compiler.hooks.run.tap(pluginName, fn)
    compiler.hooks.watchRun.tap(pluginName, fn)
  }
}
