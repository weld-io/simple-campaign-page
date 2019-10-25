/**
 * Application routes for REST
 */

'use strict'

const express = require('express')

module.exports = function (app, config) {
  const router = express.Router()
  app.use('/', router)

  // Web
  const campaignsController = require(config.root + '/server/controllers/web/campaigns')
  const peopleController = require(config.root + '/server/controllers/web/csvExport')

  router.get('/people/:id', peopleController.showPerson)

  router.get('/export/people/:campaignId', peopleController.listPeople)
  router.get('/export/people', peopleController.listPeople)

  router.get('/:slug/done', campaignsController.showDone)
  router.get('/:slug', campaignsController.show)
  router.get('/', campaignsController.list)
}
