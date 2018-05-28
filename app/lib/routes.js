/**
 * Application routes for REST
 */

'use strict';

var express = require('express');

module.exports = function (app, config) {

	var router = express.Router();
	app.use('/', router);

	// Web
	var webCampaignsController = require(config.root + '/app/controllers/web/campaigns');

	router.get('/translate/:languageCode/:id', webCampaignsController.translateAndRedirect);

	router.get('/:languageCode/:slug', webCampaignsController.showTranslated);
	router.get('/:slug', webCampaignsController.show);
	router.get('/', webCampaignsController.list);

};