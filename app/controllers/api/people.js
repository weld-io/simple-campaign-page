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

const listPeople = (req, res, next) => {
	let query = {};
	if (!_.isEmpty(req.query.campaign)) {
		query.campaign = req.query.campaign;
	}
	const sorting = { dateCreated: 1 };
	Person.find(query).sort(sorting).exec((err, result) => {
		req.crudify = req.crudify || {};
		req.crudify.err = err;
		req.crudify.result = result;
		next();
	});
};

// Public API

module.exports = function (app, config) {

	app.use(
		'/api/people',
		mongooseCrudify({
			Model: Person,
			beforeActions: [
				{ middlewares: [authenticateListRequest] },
			],
			actions: {
				list: listPeople,
			},
			endResponseInAction: false,
			afterActions: [
				{ middlewares: [helpers.sendRequestResponse] },
			],
		})
	);

};