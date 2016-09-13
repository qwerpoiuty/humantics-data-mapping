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

router.get('/systems', function(req, res) {
    models.System.find(req.body).then(function(systems) {
        res.json(systems)
    })
})

router.get('/databases', function(req, res) {
    models.Db.find(req.body.db).then(function(dbs) {
        res.json(dbs)
    })

})

router.get('/schemas', function(req, res) {
    models.Schema.find(req.body.db).then(function(schemas) {
        res.json(schemas)
    })

})

router.get('/tables', function(req, res) {
    models.Table.find(req.body.db).then(function(tables) {
        res.json(tables)
    })

})

router.get('/searchtables', function(req, res) {
    models.Attribute.find(req.body.db).then(function(attributes) {
        res.json(attributes)
    })
})

router.post('/tables', function(req, res) {
    models.Table.findOrCreate({
        where: {
            name: req.body.name
        },
        defaults: req.body
    }).spread(function(table, created) {
        if (!created) {
            res.json(false)
        }
        res.json(table)
    })
})

router.post('/attributes', function(req, res) {
    models.Attribute.findOrCreate({
        where: {
            name: req.body.name,
            endDate: req.body.endDate
        },
        defaults: req.body
    }).spread(function(attribute, created) {
        if (!created) {
            res.json(false)
        }
        res.jsos(attribute)
    })
})

module.exports = router