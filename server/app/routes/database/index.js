'use strict';
var router = require('express').Router();
var db = require('../../../db')
var Db = db.model('db')
var Schema = db.model('schema')
var Table = db.model('table')
var Attribute = db.model('attribute')

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
    Db.findAll(req.body).then(function(dbs) {
        res.json(dbs)
    })

})

router.get('/schemas', function(req, res) {
    Schema.findAll({
        where: {
            db: parseInt(req.query.dbs)
        }
    }).then(function(schemas) {
        res.json(schemas)
    })

})

router.get('/tables', function(req, res) {
    Table.findAll({
        where: {
            schema: parseInt(req.query.schema)
        }
    })
        .then(function(tables) {
            res.json(tables)
        })

})

router.get('/tableById/:tableId', function(req,res){
	db.query('select * from attributes inner join tables on attributes.table = tables.table_id inner join "schemas" on tables.schema = schemas.schema_id inner join "dbs" on schemas.db = dbs.db_id where tables.table_id = ' + req.params.tableId)
	.then(function(table){
		res.json(table)
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
router.post('/system', function(req, res) {
    // db.query('select a.name,a.datatype, a."dateModified", a."openDate",a."endDate", b.name , c.name, d.name from "attributes" as a inner join "tables" as b on a.table=b.id inner join "schemas" as c on b.schema = c.id inner join dbs as d on c.db = d.id').then(function(result) {
    //     console.log(result)
    //     res.json(result)
    // })
    db.model("db").findOrCreate({
        where: {
            name: req.body.name
        },
        defaults: req.body
    }).spread(function(result, created) {
        if (!created) {
            res.json(false)
        }
        res.json(result)
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