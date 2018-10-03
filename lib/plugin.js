'use strict'

const fs = require('fs')
const resolve = dir => require('path').resolve(__dirname, dir)
const chokidar = require('chokidar')

const pluginName = 'vue-auto-routes'

const overrideRoutes = require('./override-routes')

let watcher, isProd

class VueAutoRoutes {
  constructor (options) {
    this.options = Object.assign({}, options)
    if (!options.dir) throw new Error('`dir` is required!')
  }

  apply (compiler) {
    watcher = chokidar.watch(this.options.dir)
    isProd = /prod(uction)?/.test(process.env.NODE_ENV || this.options.env)

    const fn = () => {
      const resolveWatcher = type => {
        return watcher.on(type, () => {
          fs.writeFileSync(
            resolve('../index.js'),
            overrideRoutes(this.options)
          )
        })
      }

      resolveWatcher('add')
      resolveWatcher('unlink')
      resolveWatcher('addDir')
      resolveWatcher('unlinkDir')

      if (isProd) watcher.close()
    }

    compiler.hooks.run.tap(pluginName, fn)
    compiler.hooks.watchRun.tap(pluginName, fn)
  }
}

module.exports = VueAutoRoutes
