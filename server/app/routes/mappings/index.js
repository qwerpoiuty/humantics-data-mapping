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
    db.query('SELECT * FROM "mappings" as a inner join "attributes" as b on b.attr_id = any(a.source) inner join "tables" as c on b.table_id = c.table_id inner join schemas d on c.schema = d.schema_id inner join "dbs" as e on d.db = e.db_id WHERE a.target = ' + req.query.attr_id + ' order by a.version desc').then(function(mappings) {
        res.json(mappings)
    })
})

router.get('/recentMapping', function(req, res) {
    db.query('select * from mappings a inner join attributes b on b.attr_id = any(a.source) inner join tables as c on b.table_id = c.table_id inner join schemas d on c.schema = d.schema_id inner join dbs as e on d.db = e.db_id where a.target=' + req.query.attr_id + ' order by a.version desc')
        .then(function(mappings) {
            if (mappings[0].length == 1) {
                res.json(mappings[0])
            } else if (mappings[0].length > 1) {
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
    db.query('select * from tables inner join attributes on attributes.table_id = tables.table_id inner join mappings on attributes.attr_id = any(mappings.source) where tables.table_id =' + req.params.table_id)
        .then(function(mappings) {
            res.json(mappings)
        })
})

router.post('/', function(req, res) {
    req.body.source = "'{" + req.body.source.join(',') + "}'"
    req.body.date_created = "'" + new Date().toISOString().slice(0, 19).replace('T', ' ') + "'"
    req.body.transformation_rules = "'" + JSON.stringify(req.body.transformation_rules) + "'"
    var keys = Object.keys(req.body)
    var values = []
    for (var key in req.body) {
        values.push(req.body[key])
    }

    keys = keys.join(',')
    values = values.join(',')

    db.query('insert into mappings(' + keys + ') values(' + values + ')')
        .then(function(mapping) {
            res.sendStatus(200)
        })
})

router.post('/rules/:targetId', function(req, res) {

    db.query('update mappings set transformation_rules= ' + "'" + JSON.stringify(req.body) + "'" + 'where mappings.target=106').then(function(projects) {
        res.sendStatus(200)
    })

})

router.post('/changeStatus', function(req, res) {
    console.log('hello')
    db.query("update mappings set status='" + req.body.status + "' where mappings.target =" + req.body.id + ' and mappings.version =' + req.body.version).then(function() {
        res.sendStatus(200)
    })
})


module.exports = router