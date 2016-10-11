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
    db.query('insert into mappings(version,source,target,date_modified,modifier,comments,transformation_rules, "createdAt","updatedAt") values(' + req.body.version + ',' + sources + ',' + req.body.target + ',' + 'CURRENT_TIMESTAMP' + ',' + req.body.modifier + ',' + req.body.comments + ',' + req.body.transformation_rules + ',' + 'CURRENT_TIMESTAMP' + ',' + 'CURRENT_TIMESTAMP' + ')')
        .then(function(mapping) {
            res.sendStatus(200)
        })
})

module.exports = router