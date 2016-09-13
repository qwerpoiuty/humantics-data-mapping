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
    models.Mapping.find(req.body).then(function(mappings) {
        res.json(mappings)
    })
})

router.put('/', function(req, res) {
    models.Mapping.find(req.body.id).then(function(mapping) {
        return mapping.update(req.body)
    }).then(function(updatedMapping) {
        res.json(updatedMapping)
    })
})

router.post('/', function(req, res) {
    models.Mapping.findOrCreate({
        where: {
            name: req.body.name
        },
        defaults: req.body
    })
})

module.exports = router