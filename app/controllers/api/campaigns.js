//
// Name:    campaigns.js
// Purpose: API controller for Campaign model
// Creator: Tom Söderlund
//

'use strict';

const mongooseCrudify = require('mongoose-crudify');
const _ = require('lodash');

const helpers = require('../../lib/helpers');
const { authenticateRequest } = require('../auth');
const Campaign = require('mongoose').model('Campaign');

// Private functions

// Public API

module.exports = function (app, config) {

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