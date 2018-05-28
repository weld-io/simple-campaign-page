'use strict';

const _ = require('lodash');
const express = require('express');

module.exports.isAuthenticated = function (req) {
	return req.query.password === process.env.API_PASSWORD;
};

module.exports.getPassword = function (req) {
	return req.query.password;
};

module.exports.authenticateRequest = function (req, res, next) {
	if (req.query.password !== process.env.API_PASSWORD) {
		return res.sendStatus(401)
	}
	next();
};

module.exports.authenticateListRequest = function (req, res, next) {
	if (req.method === 'GET' && req.query.password !== process.env.API_PASSWORD) {
		return res.sendStatus(401)
	}
	next();
};
