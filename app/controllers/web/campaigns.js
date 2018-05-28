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
			campaign.originalSlug = campaign.slug;
			res.render('campaigns/show', {
				title: 'Campaigns',
				campaign: campaign,
				isAuthenticated: auth.isAuthenticated(req),
				password: auth.getPassword(req),
				languageCode: req.params.languageCode || campaign.languageCode || 'en',
			});
		});
	},

	showTranslated: function (req, res, next) {
		Campaign.findOne().elemMatch('translations', { languageCode: req.params.languageCode, slug: req.params.slug }).exec(function (err, campaign) {
			if (err || campaign === null) {
				return next(err);
			}
			const translation = _.chain(campaign.translations).find(trn => trn.languageCode === req.params.languageCode).pickBy((val, key) => key !== '_id').value();
			const translatedCampaign = _.merge({ originalSlug: campaign.slug }, campaign, translation, { languageCode: campaign.languageCode });
			res.header('Content-Language', req.params.languageCode);
			res.render('campaigns/show', {
				title: 'Campaigns',
				campaign: translatedCampaign,
				isAuthenticated: auth.isAuthenticated(req),
				password: auth.getPassword(req),
				languageCode: req.params.languageCode || campaign.languageCode || 'en',
			});
		});
	},

	translateAndRedirect: function (req, res, next) {

		const translateAll = (collection, fromLanguage, toLanguage, cbWhenAllDone) => {
			let translations = {};
			async.eachOf(collection,
				// For each
				function (str, key, cb) {
					translate(str, { from: fromLanguage, to: toLanguage }).then(result => {
						translations[key] = result.text;
						cb();
					}).catch(cb);
				},
				// When all done
				function (err) {
					cbWhenAllDone(err, translations);
				}
			);
		}

		Campaign.findById(req.params.id).exec(function (err, campaign) {
			if (err || campaign === null) {
				console.log('req.params', req.params);
				return next(err);
			}
			const toTranslate = _(campaign).pick(['title', 'description', 'comment' /*, 'keywords'*/]).pickBy(val => val !== undefined).value();
			const fromLanguage = campaign.languageCode || 'en';
			translateAll(toTranslate, fromLanguage, req.params.languageCode, (err, translations) => {
				if (err) {
					res.status(500).send(err);
				}
				else {
					const slug = helpers.toSlug(translations.title);
					const translationObj = _.merge({ languageCode: req.params.languageCode, slug: slug }, translations);
					campaign.translations.push(translationObj);
					campaign.save(errSave => {
						if (err)
							res.status(500).send(errSave);
						res.status(301).redirect(`/${req.params.languageCode}/${slug}`);
					});
				}
			})
		});
	},

}