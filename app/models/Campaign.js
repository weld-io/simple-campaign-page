'use strict';

const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const Schema = mongoose.Schema;
const helpers = require('../lib/helpers');

const campaignSchema = {
	dateCreated: { type: Date, default: Date.now },
	slug: { type: String, required: true, unique: true },
	title: { type: String, required: true },
	tagline: { type: String },
	description: { type: String },
	ctaTitle: { type: String },
	ctaUrl: { type: String },
	doneText: { type: String },
	imageUrl: { type: String },
	videoUrl: { type: String },
};

const valueDefaults = {
	emailPlaceholder: 'Enter your work email',
	ctaTitle: 'Learn more',
	doneText: 'Thank you! We will be in touch.',
	pageFooter: 'This is a campaign by Weld (Weld Your Own App AB). For questions or if you want to be removed, email contact@weld.io.',
};

const Campaign = new Schema(campaignSchema);

Campaign.plugin(findOrCreate);

// Set reference/slug
Campaign.pre('validate', function (next) {
	const slugSuggestion = this.slug || this.title;
	helpers.getUniqueSlugFromCollection('Campaign', 'slug', slugSuggestion, { documentId: this._id }, (err, uniqueSlug) => {
		this.slug = uniqueSlug;
		next();
	});
});

mongoose.model('Campaign', Campaign);

module.exports.defaults = valueDefaults;
