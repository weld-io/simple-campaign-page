'use strict'

var SimpleCampaignPageAdmin = SimpleCampaignPageAdmin || {}

;(function (SimpleCampaignPageAdmin) {
  const cleanString = function (str) { return str.replace(/\'/g, '’').replace(/\"/g, '”') }

  SimpleCampaignPageAdmin.editDataField = function (collectionName, recordId, fieldName, defaultValue, password) {
    var newData = {}
    var defaultValueJSON = JSON.stringify(defaultValue)
    // Array remove [] and 'undefined'
    var newDefaultValue = defaultValueJSON.replace(/[\[\]\"]/g, '').replace('undefined', '').replace('null', '')
    newData[fieldName] = cleanString(window.prompt(fieldName + '?', newDefaultValue))
    // Non-null = Not clicked 'Cancel'
    if (newData[fieldName] !== null) {
      // If boolean
      if (newData[fieldName] === 'true') newData[fieldName] = true
      if (newData[fieldName] === 'false') newData[fieldName] = false
      // If array, then split
      if (defaultValueJSON.indexOf('[') !== -1) {
        newData[fieldName] = newData[fieldName].split(',')
      }
      // Empty value
      if (newData[fieldName] === '') {
        newData[fieldName] = null
      }
      SimpleCampaignPage.apiRequest('put', collectionName, recordId, newData, password, function (result) {
        window.location.reload()
      })
    }
  }

  SimpleCampaignPageAdmin.addCampaign = function (password) {
    var title = cleanString(window.prompt('Campaign Title/Headline'))
    var jsonObj = { title: title }
    SimpleCampaignPage.apiRequest('post', 'campaigns', undefined, jsonObj, password, function (result) {
      window.location.reload()
    })
  }

  SimpleCampaignPageAdmin.duplicateCampaign = function (campaignId, password) {
    SimpleCampaignPage.apiRequest('post', 'campaigns/duplicate', undefined, { _id: campaignId }, password, function (result) {
      window.location.reload()
    })
  }

  SimpleCampaignPageAdmin.deleteCampaign = function (campaignId, password) {
    if (window.confirm('Delete this campaign and all users belonging to it?')) {
      SimpleCampaignPage.apiRequest('delete', 'campaigns', campaignId, undefined, password, function (result) {
        window.location.reload()
      },
      function (err) {
        window.location.reload()
      })
    }
  }

  SimpleCampaignPageAdmin.previewCampaign = function (slug, title, event) {
    var newTitle = window.prompt('What should be the custom title/headline?', title)
    if (newTitle) {
      var newUrl = window.location.origin + '/' + slug + '?title=' + newTitle.replace(/ /g, '+')
      window.location.href = newUrl
    }
  }
}(SimpleCampaignPageAdmin))
