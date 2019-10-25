//
// Name:    csvExport.js
// Purpose: Library for csvExport functions
// Creator: Tom Söderlund
//

'use strict'

const auth = require('../auth')
const Person = require('mongoose').model('Person')

// Private functions

const listPeople = function (req, res, next) {
  // Search filter
  const filter = {}
  if (req.params.campaignId) filter.campaign = req.params.campaignId
  if (req.query.after) filter.dateCreated = { $gte: new Date(req.query.after) }
  if (req.query.days) filter.dateCreated = { $gte: new Date((new Date()).getTime() + req.query.days * -24 * 60 * 60 * 1000) }
  console.log(`filter:`, filter)
  // Sorting
  const sorting = { 'dateCreated': 1 }
  // Execute query
  Person.find(filter).limit(1000).sort(sorting).populate('campaign').exec(function (err, people) {
    if (err) { return next(err) }
    if (!auth.isAuthenticated(req)) { return next({ message: 'Not authenticated', status: 404 }) }

    res.setHeader('content-type', 'text/text')
    res.render('people/csvList', {
      people: people,
      isAuthenticated: auth.isAuthenticated(req)
    })
  })
}

// Public API

module.exports = {

  listPeople

}
