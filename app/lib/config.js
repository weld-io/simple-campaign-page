const merge = require('lodash/merge')

const rootPath = require('path').join(__dirname, '/../..')
const env = process.env.NODE_ENV || 'development'

var config = {

  default: {
    root: rootPath,
    app: {
      name: 'simple-campaign-page'
    },
    port: 3041,
    triggerbeeId: process.env.TRIGGERBEE_ID
  },

  development: {
    db: 'mongodb://localhost/simple-campaign-page-development'
  },

  test: {
    port: 3000,
    db: 'mongodb://localhost/simple-campaign-page-test'
  },

  production: {
    port: 3000,
    db: process.env.MONGODB_URI || 'mongodb://localhost/simple-campaign-page-production'
  }

}

module.exports = merge({}, config.default, config[env])
