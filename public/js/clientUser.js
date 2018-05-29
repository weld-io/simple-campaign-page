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

	SimpleCampaignPage.addPerson = function (campaignId) {
		console.log(`addPerson:`, arguments);
		var jsonObj = {
			campaign: campaignId,
			email: document.getElementById('email').value,
		};
		SimpleCampaignPage.apiRequest('post', 'people', undefined, jsonObj, undefined, function(result) {
			console.log(`result:`, result);
			location.href = location.pathname + '/done';
		});
		return false;
	};

	SimpleCampaignPage.trackClickCampaign = function (slug, languageCode) {
		gtag('event', 'select_content', { content_type: slug, content: slug, language: languageCode });
	};

	SimpleCampaignPage.trackClickAd = function (event, slug, languageCode) {
		event.preventDefault();
		gtag('event', 'view_promotion', { content: slug, language: languageCode, event_callback: function () {
			location.href = event.target.parentElement.getAttribute('href');
		} });
	};

}(SimpleCampaignPage));