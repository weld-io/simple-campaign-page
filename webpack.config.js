const HtmlWebpackPlugin = require('html-webpack-plugin')

const sharedConfig = {
  mode: 'production' // 'development'
}

const userConfig = Object.assign({}, sharedConfig, {
  name: 'User',
  entry: [
    './src/public/js/clientUser.js'
  ],
  output: {
    filename: 'clientUser.js',
    path: __dirname + '/dist'
  },
  module: {
    rules: [ // formerly 'loaders'
    ]
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: __dirname + '/src/views/campaigns/list.ejs',
    //   filename: 'list.ejs'
    // })
  ]
})

const adminConfig = Object.assign({}, sharedConfig, {
  name: 'Admin',
  entry: [
    './src/public/js/clientAdmin.js'
  ],
  output: {
    filename: 'clientAdmin.js',
    path: __dirname + '/dist'
  }
})

// Return Array of Configurations
module.exports = [
  userConfig, adminConfig
]
