'use strict'

const rootPath = require('path').join(__dirname, '/../..')
const env = process.env.NODE_ENV || 'development'

var config = {

  development: {
    root: rootPath,
    app: {
      name: 'simple-campaign-page'
    },
    port: 3041,
    db: 'mongodb://localhost/simple-campaign-page-development'

  },

  test: {
    root: rootPath,
    app: {
      name: 'simple-campaign-page'
    },
    port: 3000,
    db: 'mongodb://localhost/simple-campaign-page-test'

  },

  production: {
    root: rootPath,
    app: {
      name: 'simple-campaign-page'
    },
    port: 3000,
    db: process.env.MONGODB_URI || 'mongodb://localhost/simple-campaign-page-production'

  }

}

module.exports = config[env]
