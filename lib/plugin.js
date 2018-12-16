const fs = require('fs')
const chokidar = require('chokidar')

const { collectRoutes, renderRoutes } = require('./collect-fs-routes')

const pluginName = 'vue-auto-routes'

module.exports = class VueAutoRoutes {
  constructor(options) {
    this.options = Object.assign(
      {
        watchMode: false
      },
      options
    )

    if (!options.pagesDir) throw new Error('`pagesDir` is required!')

    this.watchMode = this.options.watchMode
    delete this.options.watchMode
  }

  apply(compiler) {
    const writeRoutesFile = async () => {
      const routes = await collectRoutes(this.options)

      fs.writeFileSync(
        require('path').resolve(__dirname, '../index.js'),
        `exports.routes = ${renderRoutes(routes)}
        `
      )
    }

    const watcher = chokidar.watch(this.options.pagesDir)

    /**
     * @param {compiler} c
     */
    const fn = c => {
      const watchMode = this.watchMode || c.watchMode

      if (watchMode) {
        const resolveWatcher = type => {
          watcher.on(type, writeRoutesFile)
        }
        resolveWatcher('add')
        resolveWatcher('unlink')
      } else {
        watcher.close()
        writeRoutesFile()
      }
    }

    compiler.hooks.run.tap(pluginName, fn)
    compiler.hooks.watchRun.tap(pluginName, fn)
  }
}
