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

router.get('/databases', function(req, res) {
    if (req.body.type = "source") models.sourceDB.find(req.body.db).then(function(sourceDBS) {
        res.json(sourceDBS)
    })
    else {
        models.targetDB.find(req.body.db).then(function(targetDBS) {
            res.json(targetDBS)
        })
    }
})

router.get('/schemas', function(req, res) {
    if (req.body.type = "source") models.sourceSCHEMA.find(req.body.db).then(function(sourceSCHEMAS) {
        res.json(sourceSCHEMAS)
    })
    else {
        models.targetSCHEMA.find(req.body.db).then(function(targetSCHEMAS) {
            res.json(targetSCHEMAS)
        })
    }
})

router.get('/tables', function(req, res) {
    if (req.body.type = "source") models.sourceTABLE.find(req.body.db).then(function(sourceTABLES) {
        res.json(sourceTABLES)
    })
    else {
        models.targetTABLE.find(req.body.db).then(function(targetTABLES) {
            res.json(targetTABLES)
        })
    }
})

router.get('/searchtables', function(req, res) {
    if (req.body.type = "source") models.sourceATTRIBUTE.find(req.body.db).then(function(sourceATTRIBUTEs) {
        res.json(sourceATTRIBUTES)
    })
    else {
        models.targetATTRIBUTE.find(req.body.db).then(function(targetATTRIBUTES) {
            res.json(targetATTRIBUTES)
        })
    }
    // var schema_promises = []
    // for (var i = 0; i < Objects.keys(db); i++) {
    //     var schemas = db[Objects.keys(db)[i]].query("SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE COLUMN_NAME LIKE '%" + req.body + "'%")
    //     schema_promises.push(schemas)
    // }
    // Promise.all(schema_promises).then(function(tables) {
    //     res.json(tables)
    // })
})

module.exports = router