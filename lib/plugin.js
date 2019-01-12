const { writeFile, watch } = require('fs')
const { promisify } = require('util')
const write = promisify(writeFile)

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

      await write(
        require('path').resolve(__dirname, '../index.js'),
        `export const routes = ${renderRoutes(routes)}
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
