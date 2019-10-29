'use strict'

const mongoose = require('mongoose')
const findOrCreate = require('mongoose-findorcreate')
const Schema = mongoose.Schema
const helpers = require('../lib/helpers')

const campaignSchema = {
  dateCreated: { type: Date, default: Date.now },
  slug: { type: String, required: true, unique: true },
  // Texts: primary
  title: { type: String, required: true },
  tagline: { type: String },
  description: { type: String },
  // Texts: CTA
  ctaTitle: { type: String },
  doneText: { type: String },
  // Fields and Secondary Text
  fieldsToShow: { type: [String], default: () => { return null } },

  // Field placeholders
  emailPlaceholder: { type: String },
  companyNamePlaceholder: { type: String },
  companySizePlaceholder: { type: String },
  phonePlaceholder: { type: String },
  firstNamePlaceholder: { type: String },
  lastNamePlaceholder: { type: String },
  commentsPlaceholder: { type: String },

  pageFooter: { type: String },
  // Links
  ctaUrl: { type: String }, // e.g. download something
  imageUrl: { type: String },
  videoUrl: { type: String },
  // Styles
  darkText: { type: Boolean }
}

const valueDefaults = {
  fieldsToShow: ['email', 'companyName'],
  ctaTitle: 'Learn more',
  doneText: 'Thank you! We will be in touch.',
  pageFooter: 'This is a campaign by Weld (Weld Your Own App AB). For questions or if you want to be removed, email contact@weld.io.',

  emailPlaceholder: 'Your work email',
  companyNamePlaceholder: 'Your company name',
  companySizePlaceholder: 'Team size',
  phonePlaceholder: 'Your phone number',
  firstNamePlaceholder: 'Your first name',
  lastNamePlaceholder: 'Your last name',
  commentsPlaceholder: 'A message to us'
}

const Campaign = new Schema(campaignSchema)

Campaign.plugin(findOrCreate)

// Set reference/slug
Campaign.pre('validate', function (next) {
  const slugSuggestion = this.slug || this.title
  helpers.getUniqueSlugFromCollection('Campaign', 'slug', slugSuggestion, { documentId: this._id }, (err, uniqueSlug) => {
    this.slug = uniqueSlug
    next()
  })
})

mongoose.model('Campaign', Campaign)

module.exports.defaults = valueDefaults
