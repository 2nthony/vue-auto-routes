const fs = require('fs')
const chokidar = require('chokidar')

const { collectRoutes, renderRoutes, renderRoutesMap } = require('./collect-fs-routes')

const pluginName = 'vue-auto-routes'

let watcher, isProd

class VueAutoRoutes {
  constructor (options) {
    this.options = Object.assign({}, options)
    if (!options.pagesDir) throw new Error('`pagesDir` is required!')
  }

  apply (compiler) {
    watcher = chokidar.watch(this.options.pagesDir)
    isProd = /prod(uction)?/.test(process.env.NODE_ENV || this.options.env)

    const writeRoutesFile = async () => {
      return fs.writeFileSync(
        require('path').resolve(__dirname, '../index.js'),
        `exports.routes = ${renderRoutes((await collectRoutes(this.options)))}
        ${
  this.options.routesMap
    ? `exports.routesMap = ${renderRoutesMap((await collectRoutes(this.options)))}`
    : ''}
        `
      )
    }

    const fn = () => {
      const resolveWatcher = type =>
        watcher.on(type, () =>
          writeRoutesFile()
        )
      resolveWatcher('add')
      resolveWatcher('unlink')
      resolveWatcher('addDir')
      resolveWatcher('unlinkDir')

      if (isProd) {
        watcher.close()
        writeRoutesFile()
      }
    }

    compiler.hooks.run.tap(pluginName, fn)
    compiler.hooks.watchRun.tap(pluginName, fn)
  }
}

module.exports = VueAutoRoutes
