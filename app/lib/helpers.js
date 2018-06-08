'use strict';

const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');

module.exports = function (app, config) {

	// To string. Months are zero-based
	app.locals.formatDate = function (dateObj) {
		return moment(dateObj).format('YYYY-MM-DD');
	};

	app.locals.formatDateTime = function (dateObj) {
		return moment(dateObj).format('YYYY-MM-DD HH:mm');
	};

	app.locals.getText = (obj, field, defaults) => obj[field] || defaults[field];

	// Analytics platforms
	app.locals.getGoogleAnalyticsId = () => process.env.GOOGLE_ANALYTICS_ID || 'GOOGLE_ANALYTICS_ID not defined';
	app.locals.getLinkedInAnalyticsId = () => process.env.LINKEDIN_ANALYTICS_ID || 'LINKEDIN_ANALYTICS_ID not defined';

	app.locals.editButton = function (campaignId, fieldName, defaultValue, isAuthenticated, password, label='Edit') {
		defaultValue = typeof(defaultValue) === 'object' ? `'[${defaultValue}]'` : `'${defaultValue}'`;
		return isAuthenticated ? `<button class="action-button edit-button" onclick="SimpleCampaignPageAdmin.editDataField('campaigns', '${campaignId}', '${fieldName}', ${defaultValue}, '${password}')">${label}</button>` : '';
	};

	app.locals.editLink = function (campaignId, fieldName, defaultValue, isAuthenticated, password, label='Edit') {
		defaultValue = typeof(defaultValue) === 'object' ? `'[${defaultValue}]'` : `'${defaultValue}'`;
		return isAuthenticated ? `<a class="edit-link" onclick="SimpleCampaignPageAdmin.editDataField('campaigns', '${campaignId}', '${fieldName}', ${defaultValue}, '${password}')">${label}</a>` : '';
	};

};

// Get types for all properties for the arguments object
module.exports.logArguments = function () {
	console.log('logArguments:');
	for (let key in arguments)
		console.log(`  ${key}: ${typeof(arguments[key])}`);
};

// Get types for all properties for the arguments object
module.exports.logProperties = function (obj) {
	console.log('logProperties:');
	for (let key in obj)
		console.log(`  ${key}: ${typeof(obj[key])}`);
};

module.exports.toSlug = function (str, removeInternationalChars) {
	// Abort if not a proper string value
	if (!str || typeof(str) !== 'string')
		return str;
	// For both: change space/underscore
	var newStr = str.trim()
		.toLowerCase()
		.replace(/ /g, '-') // space to dash
		.replace(/_/g, '-') // underscore to dash
	// Remove ÅÄÖ etc?
	if (removeInternationalChars) {
		newStr = newStr.replace(/[^\w-]+/g, ''); // remove all other characters incl. ÅÄÖ
	}
	else {
		newStr = newStr.replace(/[\t.,?;:‘’“”"'`!@#$€%^&§°*<>™()\[\]{}_\+=\/\|\\]/g, ''); // remove invalid characters but keep ÅÄÖ etc
	}
	// For both: remove multiple dashes
	newStr = newStr.replace(/---/g, '-') // fix for the ' - ' case
		.replace(/--/g, '-') // fix for the '- ' case
		.replace(/--/g, '-'); // fix for the '- ' case
	return newStr;
};

// "The 21 Best Campaigns to Read - Referral SaaSquatch" -> "The 21 Best Campaigns to Read"
module.exports.splitTitle = function (str) {
	// Abort if not a proper string value
	if (!str || typeof(str) !== 'string')
		return str;
	// First normalize
	let newStr = str.replace(' - ', ' | ');
	newStr = str.replace(' – ', ' | ');
	newStr = str.replace(' — ', ' | ');
	const newArray = newStr.split(' | ');
	return newArray[0].trim();
};

// [{ reference: foo, ... }, { reference: bar, ... }] -> { foo: ..., bar: ... }
module.exports.arrayToCollection = (array, keyField='reference') => _.reduce(array, (collection, obj) => { collection[obj[keyField]] = obj; return collection; }, {});
_.mixin({ 'arrayToCollection': module.exports.arrayToCollection });

// applyToAll(func, obj1) or applyToAll(func, [obj1, obj2, ...])
module.exports.applyToAll = (func, objectOrArray) => Array.isArray(objectOrArray) ? _.map(objectOrArray, func) : func(objectOrArray);
_.mixin({ 'applyToAll': module.exports.applyToAll });

// includesSome(url, ['localhost', 'staging'])
module.exports.includesSome = function (parentObj, childObjects) {
	return _.filter(childObjects, childObj => _.includes(parentObj, childObj));
};
_.mixin({ 'includesSome': module.exports.includesSome });

// Simple JSON response, usage e.g.
// 1. helpers.sendResponse.bind(res) - err, results will be appended to end
// 2. .find((err, results) => helpers.sendResponse.call(res, err, results))
module.exports.sendResponse = function (err, results, callback) {
	const errorCode = (results === undefined || results === null)
		? 404
		: (err ? 400 : 200);
	//console.log('sendResponse', {errorCode, err, results}, typeof(callback));
	if (errorCode !== 200) {
		return this.status(errorCode).send({ error: err, code: errorCode });
	}
	else {
		if (typeof(callback) === 'function') {
			callback(results);
		}
		else if (results.toJSON) {
			return this.json(results.toJSON());
		}
		else {
			return this.json(results);
		}
	}
};

module.exports.sendRequestResponse = function (req, res, next) {
	module.exports.sendResponse.call(res, null, req.crudify.result);
};

module.exports.stripIdsFromRet = function (doc, ret, options) {
	delete ret._id;
	delete ret.__v;
};

// E.g. populate user.account with full Account structure
// helpers.populateProperties.bind(this, 'user', 'account')
module.exports.populateProperties = function ({modelName, propertyName, afterPopulate}, req, res, next) {
	req.crudify[modelName].populate(propertyName, '-_id -__v', next);
};

// From reference to MongoDB _id (or multiple _id's)
// E.g. user.account = 'my-company' --> user.account = '594e6f880ca23b37a4090fe0'
// helpers.changeReferenceToId.bind(this, 'Service', 'reference', 'services')
module.exports.changeReferenceToId = function ({modelName, parentCollection, childIdentifier}, req, res, next) {
	const modelObj = require('mongoose').model(modelName);
	let searchQuery = {};
	let lookupAction = 'find';
	const parentCollectionType = Object.prototype.toString.call(req.body[parentCollection]);
	switch (parentCollectionType) {
		case '[object String]': // One identifier
			searchQuery[childIdentifier] = req.body[parentCollection];
			break;
		case '[object Array]': // Array of identifiers
			searchQuery[childIdentifier] = { $in: req.body[parentCollection] };
			break;
		case '[object Object]': // Create new child object, e.g. create User and
			lookupAction = 'create';
			searchQuery = req.body[parentCollection];
			break;
	}
	// Do the find or create, depending on lookupAction
	modelObj[lookupAction](searchQuery, function (err, results) {
		if (!err) {
			if (results) {
				switch (parentCollectionType) {
					case '[object String]': // One identifier
						req.body[parentCollection] = results[0]._id;
						break;
					case '[object Array]': // Array of identifiers
						req.body[parentCollection] = _.map(results, '_id');
						break;
					case '[object Object]': // Create new child object, e.g. create User and
						req.body[parentCollection] = results._id;
						break;
				}
			}
			else {
				res.status(404);
				err = modelName + '(s) not found: ' + req.body[parentCollection];
			}
		}
		next(err, results);
	});
};

module.exports.toSlug = function (str, removeInternationalChars) {
	// Abort if not a proper string value
	if (!str || typeof(str) !== 'string')
		return str;
	// For both
	var newStr = str.trim()
		.toLowerCase()
		.replace(/ /g, '-') // space to dash
		.replace(/_/g, '-') // underscore to dash
	// Remove ÅÄÖ etc?
	if (removeInternationalChars) {
		newStr = newStr.replace(/[åäæâãáà]/g,'a').replace(/[ëêéè]/g,'e').replace(/[öøôõóò]/g,'o').replace(/[üûúù]/g,'u'); // convert ÅÄÖÜ to Latin characters
		newStr = newStr.replace(/[^\w-]+/g,''); // remove all other characters
	}
	else {
		newStr = newStr.replace(/[\t.,?;:‘’“”"'`!@#$€%^&§°*<>()\[\]{}_\+=\/\|\\]/g,''); // remove invalid characters but keep ÅÄÖ etc
	}
	// For both
	newStr = newStr.replace(/---/g,'-') // fix for the ' - ' case
		.replace(/--/g,'-') // fix for the '- ' case
		.replace(/--/g,'-'); // fix for the '- ' case
	return newStr;
};

module.exports.getUniqueSlug = function (existingSlugsArray, newWord, options={}) {
	const { removeInternationalChars, newWordsPositionInArray } = options;
	const slugBase = module.exports.toSlug(newWord, removeInternationalChars);
	var attemptNr = 0;
	var slugSuggestion;
	do {
		attemptNr += 1;
		slugSuggestion = slugBase + (attemptNr > 1 ? '-' + attemptNr : '');
	}
	// Find a slug that either 1) is not found in existingSlugsArray, or 2) already has a specified position in existingSlugsArray
	while (existingSlugsArray.indexOf(slugSuggestion) !== -1 && existingSlugsArray.indexOf(slugSuggestion) !== newWordsPositionInArray);
	return slugSuggestion;
};

module.exports.getUniqueSlugFromCollection = function (collectionName, keyField='reference', newWord, options={}, cb) {
	const collection = mongoose.model(collectionName);
	const newWordSlug = module.exports.toSlug(newWord, true);
	let searchQuery = {};
	searchQuery[keyField] = new RegExp('^' + newWordSlug); // begins with
	collection.find(searchQuery).exec((err, docs) => {
		const existingSlugsArray = _.map(docs, keyField);
		const { documentId } = options;
		if (documentId) options.newWordsPositionInArray = _.findIndex(docs, doc => doc._id.toString() === documentId.toString());
		const uniqueSlug = module.exports.getUniqueSlug(existingSlugsArray, newWordSlug, options);
		cb(err, uniqueSlug);
	});
};
