//
// Name:    csvExport.js
// Purpose: Library for csvExport functions
// Creator: Tom Söderlund
//

'use strict';

const auth = require('../auth');
const Person = require('mongoose').model('Person');

// Private functions

const listPeople = function (req, res, next) {
	const filter = { campaign: req.params.campaignId };
	const sorting = { 'dateCreated': 1 };
	// Execute query
	Person.find(filter).sort(sorting).exec(function (err, people) {
		if (err)
			return next(err);
		if (!auth.isAuthenticated(req))
			return next({ message: 'Not authenticated', status: 404 });

		res.setHeader('content-type', 'text/text');
		res.render('people/csvList', {
			people: people,
			isAuthenticated: auth.isAuthenticated(req),
		});
	});
};

// Public API

module.exports = {

	listPeople,

};
