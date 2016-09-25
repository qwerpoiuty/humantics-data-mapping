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
    db.query('SELECT * FROM "mappings" as a inner join "attributes" as b on a.source = b.attr_id inner join "tables" as c on b.table = c.table_id inner join schemas d on c.schema = d.schema_id inner join "dbs" as e on d.db = e.db_id WHERE a.target = ' + req.query.attr_id).then(function(mappings) {
        res.json(mappings)
    })
})

router.get('/impact/attribute/:attr_id', function(req,res){
	db.query('select * from tables a inner join attributes b on b.table = a.table_id inner join mappings c on c.target = b.attr_id where c.source =' + req.params.attr_id)
	.then(function(mappings){
		res.json(mappings)
	})
})

router.get('/impact/table/:table_id', function(req,res){
	db.query('select * from tables inner join attributes on attributes.table = tables.table_id inner join mappings on attributes.attr_id = mappings.source where tables.table_id =' + req.params.table_id)
	.then(function(mappings){
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
    Mapping.findOrCreate({
        where: {
            name: req.body.name
        },
        defaults: req.body
    }).then(function(mapping){
    	res.json(200)
    })
})

module.exports = router