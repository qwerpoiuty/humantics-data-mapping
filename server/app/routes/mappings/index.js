'use strict';
var router = require('express').Router();
var db = require('../../../db')
var Mapping = db.model('mapping')
var chalk = require('chalk')

var ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
}

router.get('/', function(req, res) {
    db.query('SELECT * FROM "mappings" as a inner join "attributes" as b on b.attr_id = any(a.source) inner join "tables" as c on b.table = c.table_id inner join schemas d on c.schema = d.schema_id inner join "dbs" as e on d.db = e.db_id WHERE a.target = ' + req.query.attr_id + ' order by a.version desc').then(function(mappings) {
        res.json(mappings)
    })
})

router.get('/recentMapping', function(req, res) {
    db.query('select * from mappings a inner join attributes b on b.attr_id = any(a.source) inner join tables as c on b.table = c.table_id inner join schemas d on c.schema = d.schema_id inner join dbs as e on d.db = e.db_id where a.target=' + req.query.attr_id + ' order by a.version desc')
        .then(function(mappings) {
            console.log(mappings[0])
            if (mappings[0].length > 0) {
                var currentVersion = mappings[0][0].version
                for (var i = 0; i < mappings[0].length; i++) {
                    if (mappings[0][i].version != currentVersion) {
                        res.json(mappings[0].slice(0, i))
                        break
                    }
                }
            } else {
                res.sendStatus(200)
            }
        })
})

router.get('/impact/attribute/:attr_id', function(req, res) {
    db.query('select * from tables a inner join attributes b on b.table = a.table_id inner join mappings c on c.target = b.attr_id where ' + req.params.attr_id + '= any(c.source)')
        .then(function(mappings) {
            res.json(mappings)
        })
})

router.get('/impact/table/:table_id', function(req, res) {
    db.query('select * from tables inner join attributes on attributes.table = tables.table_id inner join mappings on attributes.attr_id = any(mappings.source) where tables.table_id =' + req.params.table_id)
        .then(function(mappings) {
            res.json(mappings)
        })
})

router.put('/', function(req, res) {
    Mapping.find(req.body.id).then(function(mapping) {
        return mapping.update(req.body)
    }).then(function(updatedMapping) {
        res.json(updatedMapping)
    })
})

router.post('/', function(req, res) {

    var sources = "'{" + req.body.source.join(',') + "}'"
    var date = "'" + new Date().toISOString().slice(0, 19).replace('T', ' ') + "'"
    db.query('insert into mappings(version,source,target,date_created,modifier,comments,transformation_rules) values(' + req.body.version + ',' + sources + ',' + req.body.target + ',' + date + ',' + req.body.modifier + ',' + req.body.comments + ',' + req.body.transformation_rules + ')')
        .then(function(mapping) {
            res.sendStatus(200)
        })
})

module.exports = router