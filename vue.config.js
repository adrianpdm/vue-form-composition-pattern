const path = require(path);

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@dev': path.resolve(__dirname, 'dev')
      }
    }
  }
}
