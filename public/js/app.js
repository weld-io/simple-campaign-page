'use strict';

var SimpleCampaignPage = SimpleCampaignPage || {};

;(function (SimpleCampaignPage) {

	var apiRequest = function (requestType, collection, recordId, jsonObj, password, cbSuccess, cbError) {
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

	SimpleCampaignPage.editDataField = function (collectionName, recordId, fieldName, defaultValue, password) {
		var newData = {};
		var newDefaultValue = defaultValue.replace(/[\[\]]/g, ''); // array, remove []
		newData[fieldName] = prompt(fieldName + '?', newDefaultValue);
		if (newData[fieldName] !== null) {
			// If array, then split
			if (defaultValue.indexOf('[') !== -1) {
				newData[fieldName] = newData[fieldName].split(',');
			}
			apiRequest('put', collectionName, recordId, newData, password, function(result) {
				location.reload();
			});			
		}
	};

	SimpleCampaignPage.addCampaign = function (password) {
		var title = prompt('Campaign Title/Headline');
		var jsonObj = { title: title };
		// var keywords = prompt('Keywords (comma-separated, no spaces)');
		// if (keywords) jsonObj.keywords = keywords;
		// var comment = prompt('Your own comment why this is a good campaign\n(no period/exclamation point at the end)');
		// if (comment) jsonObj.comment = comment;
		apiRequest('post', 'campaigns', undefined, jsonObj, password, function(result) {
			location.reload();
			//location.href = '/' + result.slug;
		});
	};

	SimpleCampaignPage.addPerson = function (campaignId) {
		console.log(`addPerson:`, arguments);
		var jsonObj = {
			campaign: campaignId,
			email: document.getElementById('email').value,
		};
		apiRequest('post', 'people', undefined, jsonObj, undefined, function(result) {
			console.log(`result:`, result);
			//location.reload();
			//location.href = '/' + result.slug;
		});
		return false;
	};

	SimpleCampaignPage.addComment = function (campaignId, password) {
		var comment = prompt('Comment');
		apiRequest('put', 'campaigns', campaignId, { comment: comment }, password, function(result) {
			location.reload();
		});
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