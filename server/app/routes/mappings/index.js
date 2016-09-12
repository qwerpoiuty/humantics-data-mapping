'use strict';
var router = require('express').Router();
var models = require('../../../db')
var chalk = require('chalk')

var ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
}

router.get('/', function(req, res) {
    //raw queries?
})

module.exports = router