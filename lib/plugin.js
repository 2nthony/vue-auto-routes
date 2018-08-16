'use strict'

const fs = require('fs')
const resolve = dir => require('path').resolve(__dirname, dir)
const chokidar = require('chokidar')

const pluginName = 'vue-auto-routes'

const formatter = require('./formatter')

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
        return watcher.on(type, () => {
          formatter(this.options).then(code => {
            fs.writeFileSync(resolve('../index.js'), code)
          })
        })
      }

      Promise.all([watcherPromise('add'), watcherPromise('unlink')])

      if (/prod(uction)?/.test(process.env[this.options.env || 'NODE_ENV'])) {
        watcher.close()
      }
    }

    compiler.hooks.run.tap(pluginName, generator)
    compiler.hooks.watchRun.tap(pluginName, generator)
  }
}

module.exports = VueAutoRoutes
