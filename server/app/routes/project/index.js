'use strict';
var router = require('express').Router();
var db = require('../../../db')
var Project = project.model('project')

var chalk = require('chalk')


var ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
}


