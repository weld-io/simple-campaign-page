//
// Name:    campaigns.js
// Purpose: Web view controller for Campaign model
// Creator: Tom Söderlund
//

'use strict';

const mongoose = require('mongoose');
const _ = require('lodash');
const async = require('async');

const auth = require('../auth');
const helpers = require('../../lib/helpers');
const Campaign = mongoose.model('Campaign');

module.exports = {

	list: function (req, res, next) {
		var searchQuery = {};
		if (req.params.after) {
			searchQuery['dateCreated'] = searchQuery['dateCreated'] || {};
			searchQuery['dateCreated']['$gte'] = new Date(req.params.after);
		}
		if (req.params.before) {
			searchQuery['dateCreated'] = searchQuery['dateCreated'] || {};
			searchQuery['dateCreated']['$lt'] = new Date(req.params.before);
		}

		const sorting = { 'dateCreated': -1 };
		// Execute query
		Campaign.find(searchQuery).limit(50).sort(sorting).exec(function (err, campaigns) {
			if (err)
				return next(err);
			res.render('campaigns/list', {
				title: 'Campaigns',
				campaigns: campaigns,
				isAuthenticated: auth.isAuthenticated(req),
				password: auth.getPassword	(req),
			});
		});
	},

	show: function (req, res, next) {
		Campaign.findOne({ slug: req.params.slug }).exec(function (err, campaign) {
			if (err || campaign === null) {
				return next(err);
			}
			res.render('campaigns/show', {
				title: 'Campaign',
				campaign: campaign,
				isAuthenticated: auth.isAuthenticated(req),
				password: auth.getPassword(req),
			});
		});
	},

	showDone: function (req, res, next) {
		Campaign.findOne({ slug: req.params.slug }).exec(function (err, campaign) {
			if (err || campaign === null) {
				return next(err);
			}
			res.render('campaigns/showDone', {
				title: 'Campaign - done',
				campaign: campaign,
				isAuthenticated: auth.isAuthenticated(req),
				password: auth.getPassword(req),
			});
		});
	},

}