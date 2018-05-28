'use strict';

const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const Schema = mongoose.Schema;

const Campaign = new Schema({
	dateCreated: { type: Date, default: Date.now },
	slug: { type: String, required: true, unique: true },
	title: { type: String, required: true },
	tagline: { type: String },
	description: { type: String },
	ctaTitle: { type: String },
	ctaUrl: { type: String },
	imageUrl: { type: String },
	videoUrl: { type: String },
});

Campaign.plugin(findOrCreate);

// Set reference/slug
Campaign.pre('validate', function (next) {
	const slugSuggestion = this.slug || this.title;
	console.log(`Campaign.pre.validate:`, this.slug, this);
	helpers.getUniqueSlugFromCollection('Campaign', 'slug', slugSuggestion, { documentId: this._id }, (err, uniqueSlug) => {
		this.slug = uniqueSlug;
		next();
	});
});

mongoose.model('Campaign', Campaign);
