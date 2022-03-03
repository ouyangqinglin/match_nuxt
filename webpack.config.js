const path = require('path')

module.exports = {
  debug: true,
  devtool: 'source-map',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      'assets': path.resolve('./assets'),
      '@img': path.resolve('./assets/img'),
      '@comp': path.resolve('./components'),
      '@js': path.resolve('./assets/js'),
      '@pages': path.resolve('./pages'),
    }
  },
}
