'use strict'

var SimpleCampaignPage = SimpleCampaignPage || {}

;(function (SimpleCampaignPage) {
  SimpleCampaignPage.apiRequest = function (requestType, collection, recordId, jsonObj, password, cbSuccess, cbError) {
    $.ajax({
      url: '/api/' + collection + (recordId ? '/' + recordId : '') + '?password=' + password,
      type: requestType.toUpperCase(),
      contentType: 'application/json',
      data: JSON.stringify(jsonObj),
      success: cbSuccess || function (result) {
        console.log('success', result)
      },
      error: cbError || function (err) {
        console.error('error', err)
      }
    })
  }

  SimpleCampaignPage.setElementDisabled = function (elementId, setDisabled) {
    setDisabled
      ? document.getElementById(elementId).setAttribute('disabled', true)
      : document.getElementById(elementId).removeAttribute('disabled')
  }

  SimpleCampaignPage.addPerson = function (campaignId, slug) {
    var email = document.getElementById('email').value.toLowerCase()
    if (email.length < 6 || email.split('@').length !== 2 || email.split('@')[1].indexOf('.') === -1) {
      window.alert('Please fill in a valid email address')
      return false
    }

    var companyName = document.getElementById('companyName').value
    if (companyName.length < 3) {
      window.alert('Please fill in a valid company name')
      return false
    }

    // Validation complete, let's go!
    SimpleCampaignPage.setElementDisabled('email', true)
    SimpleCampaignPage.setElementDisabled('submitButton', true)

    var campaignTitle = document.getElementById('title').innerHTML

    var jsonObj = {
      campaign: campaignId,
      campaignTitle: campaignTitle,
      email: email,
      companyName: companyName
    }

    // Post to server
    SimpleCampaignPage.apiRequest('post', 'people', undefined, jsonObj, undefined, function (result) {
      SimpleCampaignPage.trackSignup(slug, function () {
        location.href = location.href.replace(location.pathname, location.pathname + '/done')
      })
      SimpleCampaignPage.createTriggerbeeContact(email, companyName, campaignTitle)
    })
    return false
  }

  // Event codes: https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce
  SimpleCampaignPage.trackSignup = function (slug, cb) {
    gtag('event', 'sign_up', {
      content: slug,
      event_callback: cb
    })
  }

  SimpleCampaignPage.trackGetContent = function (event, slug) {
    event.preventDefault()
    gtag('event', 'get_content', {
      content: slug,
      event_callback: function () {
        location.href = event.target.getAttribute('href')
      }
    })
  }

  SimpleCampaignPage.createTriggerbeeContact = function (email, company, goal) {
    try {
      if (window.mtr_custom) {
        var tbContact = window.mtr_custom || {}
        tbContact.session = tbContact.session || {}
        if (company) tbContact.session.organization = company
        if (email) tbContact.session.email = email
        window.mtr_custom = tbContact
        if (window.mtr && goal) window.mtr.goal(goal)
      }
    } catch (err) {
      console.warn('Warning:' + err.message || err)
    }
  }
}(SimpleCampaignPage))
