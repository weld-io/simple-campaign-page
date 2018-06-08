/**
 * Application routes for REST
 */

'use strict';

const express = require('express');

module.exports = function (app, config) {

	const router = express.Router();
	app.use('/', router);

	// Web
	const campaignsController = require(config.root + '/app/controllers/web/campaigns');
	const csvExportController = require(config.root + '/app/controllers/web/csvExport');

	router.get('/export/people/:campaignId', csvExportController.listPeople);

	router.get('/:slug/done', campaignsController.showDone);
	router.get('/:slug', campaignsController.show);
	router.get('/', campaignsController.list);

};