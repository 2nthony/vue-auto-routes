module.exports = {
  chainWebpack(config) {
    config.resolve.alias.set('vue$', 'vue/dist/vue.esm')
    config.plugin('auto-routes').use(require('../plugin'), [
      {
        pagesDir: require('path').resolve(__dirname, 'src/pages')
      }
    ])
  }
}
