const path = require('path')
const { writeFile, watch } = require('fs')
const { promisify } = require('util')
const { collectRoutes, renderRoutes } = require('./collect-fs-routes')

const write = promisify(writeFile)

const pluginName = 'vue-auto-routes'

module.exports = class VueAutoRoutes {
  constructor(opts) {
    this.opts = Object.assign(
      {
        watchMode: false,
        default404: true
      },
      opts
    )

    if (opts.pagesDir) {
      console.warn(
        '[vue-auto-routes]: please use the new API `dir` to instead of the DEPRECATED `pagesDir`.'
      )
      this.opts.dir = opts.pagesDir
    }
    if (!this.opts.dir) throw new Error('`dir` is required!')

    this.watchMode = this.opts.watchMode
    this.default404 = this.opts.default404
    delete this.opts.watchMode
    delete this.opts.default404
  }

  apply(compiler) {
    const writeRoutesFile = async () => {
      const routes = await collectRoutes(this.opts)

      if (this.default404 && !routes.find(({ path }) => path === '/404')) {
        routes.push({
          path: '*',
          component: path.resolve(__dirname, '../404.vue')
        })
      }

      await write(
        path.resolve(__dirname, '../index.js'),
        `export const routes = ${renderRoutes(routes, {
          dir: this.opts.dir
        })}
        `
      )
    }

    const fn = c => {
      const watchMode = this.watchMode || c.watchMode

      if (watchMode) {
        const watcher = watch(this.opts.dir, { recursive: true })
        watcher.on('change', writeRoutesFile)
      }
    }

    writeRoutesFile()

    compiler.hooks.run.tap(pluginName, fn)
    compiler.hooks.watchRun.tap(pluginName, fn)
  }
}
