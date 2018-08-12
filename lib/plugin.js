'use strict'

const fs = require('fs')
const resolve = dir => require('path').resolve(__dirname, dir)
const chokidar = require('chokidar')

const pluginName = 'vue-auto-routes'

const formatRoutes = require('./format-routes')

let watcher

class VueAutoRoutes {
  constructor (options) {
    this.options = options
    if (!options.pages) throw new Error('`pages` is required!')
  }

  apply (compiler) {
    watcher = chokidar.watch(this.options.pages)

    const generator = () => {
      const watcherPromise = type => {
        return watcher.on(type, file => {
          formatRoutes(this.options).then(code => {
            fs.writeFileSync(resolve('../index.js'), code)

            watcher.close()
          })
        })
      }

      Promise.all([watcherPromise('add'), watcherPromise('unlink')])
    }

    compiler.hooks.run.tap(pluginName, generator)
    compiler.hooks.watchRun.tap(pluginName, generator)
  }
}

module.exports = VueAutoRoutes
