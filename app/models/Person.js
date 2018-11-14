'use strict';

const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const Schema = mongoose.Schema;
const helpers = require('../lib/helpers');

const Person = new Schema({
	dateCreated: { type: Date, default: Date.now },
	campaign: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
	campaignTitle: { type: String },
	email: { type: String, required: true },
	phone: { type: String },
	firstName: { type: String },
	lastName: { type: String },
	companyName: { type: String },
});

Person.plugin(findOrCreate);

Person.index({ campaign: 1, email: 1 });

mongoose.model('Person', Person);
