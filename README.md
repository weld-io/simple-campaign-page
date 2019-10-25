# Simple Campaign Page

Simple Campaign Page makes it easy to set up landing pages with very little configuration.

![Simple Campaign Page](docs/example.jpg)

Made by the team at **Weld** ([www.weld.io](https://www.weld.io?utm_source=github-simple-campaign-page)), the #codefree app and web creation tool:

[![Weld](https://s3-eu-west-1.amazonaws.com/weld-social-and-blog/gif/weld_explained.gif)](https://www.weld.io?utm_source=github-simple-campaign-page)


## How to Run

(Optional) Set variables:

	export API_PASSWORD=xxx
	export GOOGLE_ANALYTICS_ID=UA-xxx
	export LINKEDIN_ANALYTICS_ID=xxx

Start with:

	export API_PASSWORD=123
	yarn dev # development mode

or

	yarn start # production mode

Server will default to **http://localhost:3041**


## How to Test

	yarn test


## Entities

* **Campaign**: ad campaign.
* **Person**: a person that signs up.


## Todo


## CSV export

All campaigns:

	http://localhost:3041/export/people?password=[API_PASSWORD]&after=2018-06-07
	http://localhost:3041/export/people?password=[API_PASSWORD]&days=30

* `after=` a date
* `days=` the last n days

One campaign:

	http://localhost:3041/export/people/5b0d04a2ad36c2a694ca987e?password=[API_PASSWORD]


## REST API

### Campaigns

List campaigns

	curl http://localhost:3041/api/campaigns?password=[API_PASSWORD]

Get a specific campaign

	curl http://localhost:3041/api/campaigns/[CAMPAIGN_ID]?password=[API_PASSWORD]

Create new campaign:

	curl -X POST -H "Content-Type: application/json" http://localhost:3041/api/campaigns?password=[API_PASSWORD] -d '{ "title": "My Awesome Campaign" }'

Duplicate an existing campaign:

	curl -X POST -H "Content-Type: application/json" http://localhost:3041/api/campaigns/duplicate?password=[API_PASSWORD] -d '{ "_id": "XXXX" }'

Update an campaign:

	curl -X PUT -H "Content-Type: application/json" http://localhost:3041/api/campaigns/[CAMPAIGN_ID]?password=[API_PASSWORD] -d '{}'

Delete campaign:

	curl -X DELETE http://localhost:3041/api/campaigns/[CAMPAIGN_ID]?password=[API_PASSWORD]

Delete all campaigns:

	curl -X DELETE http://localhost:3041/api/campaigns?password=[API_PASSWORD]


## Deploying on Heroku

	heroku create MYAPPNAME
	heroku addons:create mongolab
	heroku config:set GOOGLE_ANALYTICS_ID=UA-xxx
	heroku config:set LINKEDIN_ANALYTICS_ID=xxx
	heroku config:set API_PASSWORD=xxx
	git push heroku master
