'use strict';

var SimpleCampaignPage = SimpleCampaignPage || {};

;(function (SimpleCampaignPage) {

	SimpleCampaignPage.apiRequest = function (requestType, collection, recordId, jsonObj, password, cbSuccess, cbError) {
		$.ajax({
			url: '/api/' + collection + (recordId ? '/' + recordId : '') + '?password=' + password,
			type: requestType.toUpperCase(),
			contentType: 'application/json',
			data: JSON.stringify(jsonObj),
			success: cbSuccess || function(result) {
				console.log('success', result);
			},
			error: cbError || function(err) {
				console.error('error', err);
			},
		});
	};

	SimpleCampaignPage.setElementDisabled = function (elementId, setDisabled) {
		setDisabled
			? document.getElementById(elementId).setAttribute('disabled', true)
			: document.getElementById(elementId).removeAttribute('disabled');
	};

	SimpleCampaignPage.addPerson = function (campaignId, slug) {

		var campaignTitle = document.getElementById('title').innerHTML;

		var email = document.getElementById('email').value;
		if (email.length < 6 || email.split('@').length !== 2 || email.split('@')[1].indexOf('.') === -1) {
			alert('Please fill in a valid email address');
			return false;
		}

		var companyName = document.getElementById('companyName').value;
		if (companyName.length < 3) {
			alert('Please fill in a valid company name');
			return false;
		}

		var jsonObj = {
			campaign: campaignId,
			campaignTitle: campaignTitle,
			email: email,
			companyName: companyName,
		};
		SimpleCampaignPage.setElementDisabled('email', true);
		SimpleCampaignPage.setElementDisabled('submitButton', true);
		SimpleCampaignPage.apiRequest('post', 'people', undefined, jsonObj, undefined, function(result) {
			console.log(`result:`, result);
			SimpleCampaignPage.setElementDisabled('email', false);
			SimpleCampaignPage.setElementDisabled('submitButton', false);
			SimpleCampaignPage.trackSignup(slug, function () {
				location.href = location.href.replace(location.pathname, location.pathname + '/done');
			});
		});
		return false;
	};

	// Event codes: https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce
	SimpleCampaignPage.trackSignup = function (slug, cb) {
		gtag('event', 'sign_up', {
			content: slug,
			event_callback: cb,
		});
	};

	SimpleCampaignPage.trackGetContent = function (event, slug) {
		event.preventDefault();
		gtag('event', 'get_content', {
			content: slug,
			event_callback: function () {
				location.href = event.target.getAttribute('href');
			}
		});
	};

}(SimpleCampaignPage));