const path = require('path')
const { writeFile: _writeFile, watch } = require('fs')
const { promisify } = require('util')
const VueRouterVersion = require('vue-router/package.json').version
const { collectRoutes, renderRoutes } = require('./collect-fs-routes')

const v4 = VueRouterVersion.slice(0, 1) === '4'

const writeFile = promisify(_writeFile)

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
    const fn = c => {
      const watchMode = this.watchMode || c.watchMode

      if (watchMode) {
        const watcher = watch(this.opts.dir, { recursive: true })
        watcher.on('change', this.writeRoutesFile.bind(this))
      }
    }

    this.writeRoutesFile()

    compiler.hooks.run.tap(pluginName, fn)
    compiler.hooks.watchRun.tap(pluginName, fn)
  }

  async handleRoutesString() {
    const routes = await collectRoutes(this.opts)

    const extraRoutes = []
    if (this.default404 && !routes.find(({ path }) => path === '/404')) {
      extraRoutes.push({
        path: '/404',
        component: path.relative(
          process.cwd(),
          path.join(__dirname, '../404.vue')
        )
      })
    }

    return `export const routes = ${renderRoutes(routes, {
      extraRoutes,
      v4
    })}
    `
  }

  async writeRoutesFile() {
    await writeFile(
      path.resolve(__dirname, '../index.js'),
      await this.handleRoutesString()
    )
  }
}
