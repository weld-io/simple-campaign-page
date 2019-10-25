'use strict'

const bodyParser = require('body-parser')
const cacheControl = require('express-cache-controller')
const compression = require('compression')
const minify = require('express-minify')
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
const express = require('express')
// const favicon = require('serve-favicon');
const glob = require('glob')
const morgan = require('morgan') // logger
// const methodOverride = require('method-override');

module.exports = function (app, config) {
  app.set('views', config.root + '/src/views')
  app.set('view engine', 'ejs')

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(morgan('dev'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  // app.use(cookieParser());
  app.use(cacheControl({
    maxAge: 7 * 24 * 60 * 60 * 1000
  }))
  app.use(compression())
  app.use(minify({
    // cache: false,
    // uglifyJsModule: null,
    // errorHandler: null,
    jsMatch: /js/,
    cssMatch: /css/
  }))
  app.use(express.static(config.root + '/src/public'))

  // Other NPMs
  app.use('/weld-static-assets', express.static(config.root + '/node_modules/@weld-io/weld-static-assets'))
  // app.use(methodOverride());
  // app.use(cors());

  // Routing

  // Require in all API controllers
  glob.sync(config.root + '/server/controllers/api/*.js').forEach(controllerPath => require(controllerPath)(app, config))

  // Other routes
  require('./routes')(app, config)

  app.use(function (req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
  })

  if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500)
      res.render('shared/error', {
        message: err.message,
        error: err,
        title: 'error'
      })
    })
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('shared/error', {
      message: err.message,
      error: {},
      title: 'error'
    })
  })
}
