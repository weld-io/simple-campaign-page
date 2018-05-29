//
// Name:    campaigns.js
// Purpose: API controller for Campaign model
// Creator: Tom Söderlund
//

'use strict';

const express = require('express');
const mongooseCrudify = require('mongoose-crudify');
const _ = require('lodash');

const helpers = require('../../lib/helpers');
const { authenticateRequest } = require('../auth');
const Campaign = require('mongoose').model('Campaign');

// Private functions

const duplicateCampaign = (req, res, next) => {
	Campaign.findById(req.body._id).exec((findErr, oldCampaign) => {
		const newCampaign = _.omit(oldCampaign.toJSON(), ['_id', 'dateCreated', '__v']);
		Campaign.create(newCampaign, (createErr, createdCampaign) => {
			res.status(createErr ? 400 : 200).json(createdCampaign);
		});
	});
};

// Public API

module.exports = function (app, config) {

	// Special routes
	const router = express.Router();
	app.use('/', router);
	router.post('/api/campaigns/duplicate', duplicateCampaign);

	app.use(
		'/api/campaigns',
		mongooseCrudify({
			Model: Campaign,
			beforeActions: [
				{ middlewares: [authenticateRequest] },
			],
			endResponseInAction: false,
			afterActions: [
				{ middlewares: [helpers.sendRequestResponse] },
			],
		})
	);

};