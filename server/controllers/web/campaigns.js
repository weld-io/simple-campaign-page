//
// Name:    campaigns.js
// Purpose: Web view controller for Campaign model
// Creator: Tom Söderlund
//

'use strict'

const mongoose = require('mongoose')

const auth = require('../auth')
const Campaign = mongoose.model('Campaign')
const campaignData = require('../../models/Campaign')
const config = require('../../lib/config')

module.exports = {

  list: function (req, res, next) {
    var searchQuery = {}
    if (req.params.after) {
      searchQuery['dateCreated'] = searchQuery['dateCreated'] || {}
      searchQuery['dateCreated']['$gte'] = new Date(req.params.after)
    }
    if (req.params.before) {
      searchQuery['dateCreated'] = searchQuery['dateCreated'] || {}
      searchQuery['dateCreated']['$lt'] = new Date(req.params.before)
    }

    const sorting = { 'dateCreated': -1 }
    // Execute query
    Campaign.find(searchQuery).limit(50).sort(sorting).exec(function (err, campaigns) {
      if (err) { return next(err) }
      res.render('campaigns/list', {
        pageTitle: 'Campaigns',
        campaigns: campaigns,
        isAuthenticated: auth.isAuthenticated(req),
        password: auth.getPassword(req)
      })
    })
  },

  show: function (req, res, next) {
    Campaign.findOne({ slug: req.params.slug }).exec(function (err, campaign) {
      if (err || campaign === null) {
        return next(err)
      }
      const campaignWithDefaults = Object.assign({}, campaignData.defaults, campaign.toObject())
      const fieldsToShow = campaign.fieldsToShow || campaignData.defaults.fieldsToShow
      res.render('campaigns/show', {
        pageTitle: req.query.title || campaign.title,
        pageDescription: `${campaign.tagline ? `${campaign.tagline} – ` : ''}${campaign.description}`,
        campaign: campaignWithDefaults,
        defaults: campaignData.defaults,
        fieldsToShow,
        isAuthenticated: auth.isAuthenticated(req),
        password: auth.getPassword(req),
        triggerbeeId: config.triggerbeeId
      })
    })
  },

  showDone: function (req, res, next) {
    Campaign.findOne({ slug: req.params.slug }).exec(function (err, campaign) {
      if (err || campaign === null) {
        return next(err)
      }
      const campaignWithDefaults = Object.assign({}, campaignData.defaults, campaign.toObject())
      res.render('campaigns/showDone', {
        pageTitle: req.query.title || campaign.title,
        pageDescription: `${campaign.tagline ? `${campaign.tagline} – ` : ''}${campaign.description}`,
        campaign: campaignWithDefaults,
        defaults: campaignData.defaults,
        isAuthenticated: auth.isAuthenticated(req),
        password: auth.getPassword(req),
        triggerbeeId: config.triggerbeeId
      })
    })
  }

}
