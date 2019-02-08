//
// Name:    people.js
// Purpose: API controller for Person model
// Creator: Tom Söderlund
//

'use strict'

const mongooseCrudify = require('mongoose-crudify')

const helpers = require('../../lib/helpers')
const { authenticateListRequest } = require('../auth')
const Person = require('mongoose').model('Person')

// Private functions

const listPeople = (req, res, next) => {
  // Search filter
  const filter = {}
  if (req.query.campaign) filter.campaign = req.query.campaign
  if (req.query.after) filter.dateCreated = { $gte: new Date(req.query.after) }
  if (req.query.days) filter.dateCreated = { $gte: new Date((new Date()).getTime() + req.query.days * -24 * 60 * 60 * 1000) }
  // Sorting
  const sorting = { dateCreated: 1 }
  Person.find(filter).sort(sorting).exec((err, result) => {
    req.crudify = req.crudify || {}
    req.crudify.err = err
    req.crudify.result = result
    next()
  })
}

const createPerson = function (req, res, next) {
  const newPerson = req.body
  Person.findOrCreate({
    email: newPerson.email,
    campaign: newPerson.campaign
  },
  newPerson,
  function (err, result, wasCreated) {
    const doResult = (err, result) => {
      req.crudify = { err, result, person: result }
      next()
    }

    if (wasCreated) {
      // New person
      doResult(err, result)
    } else {
      // Update existing person
      result.campaign = newPerson.campaign
      result.save(doResult)
    }
  })
}

// Public API

module.exports = function (app, config) {
  app.use(
    '/api/people',
    mongooseCrudify({
      Model: Person,
      beforeActions: [
        { middlewares: [authenticateListRequest] }
      ],
      actions: {
        list: listPeople,
        create: createPerson
      },
      endResponseInAction: false,
      afterActions: [
        { middlewares: [helpers.sendRequestResponse] }
      ]
    })
  )
}
