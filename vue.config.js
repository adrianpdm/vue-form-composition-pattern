// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@dev': path.resolve(__dirname, 'dev'),
        '@lib': path.resolve(__dirname, 'lib'),
      },
    },
  },
}
