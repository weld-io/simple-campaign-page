/**
 * Application routes for REST
 */

'use strict';

const express = require('express');

module.exports = function (app, config) {

	const router = express.Router();
	app.use('/', router);

	// Web
	const webCampaignsController = require(config.root + '/app/controllers/web/campaigns');

	router.get('/:slug/done', webCampaignsController.showDone);
	router.get('/:slug', webCampaignsController.show);
	router.get('/', webCampaignsController.list);

};