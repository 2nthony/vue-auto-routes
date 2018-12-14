const fs = require('fs')
const chokidar = require('chokidar')

const {
  collectRoutes,
  renderRoutes
} = require('./collect-fs-routes')

const pluginName = 'vue-auto-routes'

class VueAutoRoutes {
  constructor(options) {
    this.options = Object.assign({}, options)
    if (!options.pagesDir) throw new Error('`pagesDir` is required!')
  }

  get isProd() {
    return /prod(uction)?/.test(process.env.NODE_ENV || this.options.env)
  }

  apply(compiler) {
    const watcher = chokidar.watch(this.options.pagesDir)

    const writeRoutesFile = async () => {
      const routes = await collectRoutes(this.options)

      return fs.writeFileSync(
        require('path').resolve(__dirname, '../index.js'),
        `exports.routes = ${renderRoutes(routes)}
        `
      )
    }

    const fn = () => {
      const resolveWatcher = type =>
        watcher.on(type, () => writeRoutesFile())

      resolveWatcher('add')
      resolveWatcher('unlink')

      if (this.isProd) {
        watcher.close()
        writeRoutesFile()
      }
    }

    compiler.hooks.run.tap(pluginName, fn)
    compiler.hooks.watchRun.tap(pluginName, fn)
  }
}

module.exports = VueAutoRoutes
