'use strict'

var SimpleCampaignPageAdmin = SimpleCampaignPageAdmin || {}

;(function (SimpleCampaignPageAdmin) {
  const cleanString = function (str) { return str.replace(/\'/g, '’').replace(/\"/g, '”') }

  SimpleCampaignPageAdmin.editDataField = function (collectionName, recordId, fieldName, defaultValue, password) {
    var newData = {}
    // Array remove [] and 'undefined'
    var newDefaultValue = defaultValue.replace(/[\[\]]/g, '').replace('undefined', '')
    newData[fieldName] = cleanString(window.prompt(fieldName + '?', newDefaultValue))
    // Non-null = Not clicked 'Cancel'
    if (newData[fieldName] !== null) {
      // If boolean
      if (newData[fieldName] === 'true') newData[fieldName] = true
      // If array, then split
      if (defaultValue.indexOf('[') !== -1) {
        newData[fieldName] = newData[fieldName].split(',')
      }
      // Empty value
      if (newData[fieldName] === '') {
        newData[fieldName] = null
      }
      SimpleCampaignPage.apiRequest('put', collectionName, recordId, newData, password, function (result) {
        location.reload()
      })
    }
  }

  SimpleCampaignPageAdmin.addCampaign = function (password) {
    var title = cleanString(window.prompt('Campaign Title/Headline'))
    var jsonObj = { title: title }
    SimpleCampaignPage.apiRequest('post', 'campaigns', undefined, jsonObj, password, function (result) {
      location.reload()
    })
  }

  SimpleCampaignPageAdmin.duplicateCampaign = function (campaignId, password) {
    SimpleCampaignPage.apiRequest('post', 'campaigns/duplicate', undefined, { _id: campaignId }, password, function (result) {
      location.reload()
    })
  }

  SimpleCampaignPageAdmin.deleteCampaign = function (campaignId, password) {
    console.log(`delete: "${campaignId}"`)
    if (window.confirm('Delete this campaign and all users belonging to it?')) {
      SimpleCampaignPage.apiRequest('delete', 'campaigns', campaignId, undefined, password, function (result) {
        location.reload()
      },
      function (err) {
        location.reload()
      })
    }
  }
}(SimpleCampaignPageAdmin))
