'use strict';

var SimpleCampaignPageAdmin = SimpleCampaignPageAdmin || {};

;(function (SimpleCampaignPageAdmin) {

	SimpleCampaignPage.editDataField = function (collectionName, recordId, fieldName, defaultValue, password) {
		var newData = {};
		var newDefaultValue = defaultValue.replace(/[\[\]]/g, ''); // array, remove []
		newData[fieldName] = prompt(fieldName + '?', newDefaultValue);
		if (newData[fieldName] !== null) {
			// If array, then split
			if (defaultValue.indexOf('[') !== -1) {
				newData[fieldName] = newData[fieldName].split(',');
			}
			SimpleCampaignPage.apiRequest('put', collectionName, recordId, newData, password, function (result) {
				location.reload();
			});			
		}
	};

	SimpleCampaignPageAdmin.addCampaign = function (password) {
		var title = prompt('Campaign Title/Headline');
		var jsonObj = { title: title };
		SimpleCampaignPage.apiRequest('post', 'campaigns', undefined, jsonObj, password, function (result) {
			location.reload();
		});
	};

	SimpleCampaignPageAdmin.duplicateCampaign = function (campaignId, password) {
		console.log(`duplicate: "${campaignId}"`);
	};

	SimpleCampaignPageAdmin.deleteCampaign = function (campaignId, password) {
		console.log(`delete: "${campaignId}"`);
		if (confirm('Delete this campaign and all users belonging to it?')) {
			SimpleCampaignPage.apiRequest('delete', 'campaigns', campaignId, undefined, password, function (result) {
				location.reload();
			});			
		}
	};

}(SimpleCampaignPageAdmin));