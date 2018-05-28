//
// Name:    people.js
// Purpose: API controller for Person model
// Creator: Tom Söderlund
//

'use strict';

const mongooseCrudify = require('mongoose-crudify');
const _ = require('lodash');

const helpers = require('../../lib/helpers');
const { authenticateListRequest } = require('../auth');
const Person = require('mongoose').model('Person');

// Private functions

// Public API

module.exports = function (app, config) {

	app.use(
		'/api/people',
		mongooseCrudify({
			Model: Person,
			beforeActions: [
				{ middlewares: [authenticateListRequest] },
			],
			endResponseInAction: false,
			afterActions: [
				{ middlewares: [helpers.sendRequestResponse] },
			],
		})
	);

};