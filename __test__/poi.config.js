const path = require('path')

module.exports = {
  entry: path.join(__dirname, 'main.js'),
  chainWebpack(config) {
    config.plugin('auto-routes').use(require('../plugin'), [
      {
        dir: path.join(__dirname, '../__test__/views'),
        match: 'vue,js'
      }
    ])
  }
}
