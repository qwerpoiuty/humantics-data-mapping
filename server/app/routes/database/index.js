'use strict';
var router = require('express').Router();
var db = require('../../../db')
var Db = db.model('db')
var Schema = db.model('schema')
var Table = db.model('table')
var Attribute = db.model('attribute')
var moment = require('moment')
var chalk = require('chalk')


var ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
}

//high level gets
router.get('/systems', function(req, res) {
    db.query('select * from systems').then(function(systems) {
        res.json(systems)
    })
})

router.get('/databases', function(req, res) {
    db.query(`select * from dbs where dbs.system = ${parseInt(req.query.system)}`).then(function(dbs) {
        res.json(dbs)
    })

})

router.get('/schemas', function(req, res) {
    db.query('select * from schemas where schemas.db = ' + parseInt(req.query.db)).then(function(schemas) {
        res.json(schemas)
    })

})

router.get('/tables', function(req, res) {
    db.query('select * from tables inner join schemas on tables.schema = schemas.schema_id inner join dbs on schemas.db = dbs.db_id inner join systems on dbs.system = systems.system_id where tables.schema = ' + parseInt(req.query.schema))
        .then(function(tables) {
            res.json(tables)
        })

})

router.get('/attributes', function(req, res) {
    db.query('select * from attributes where attributes.table_id = ' + parseInt(req.query.attribute))
        .then(function(attributes) {
            res.json(attributes)
        })
})

//specific gets
router.get('/recentTable', function(req, res) {
    db.query('select MAX(table_id) from tables')
        .then(function(table_id) {
            console.log(table_id[0])
            res.json(table_id[0][0].max)
        })
})
router.get('/tableById/:tableId', function(req, res) {
    db.query('select * from tables inner join schemas on tables.schema = schemas.schema_id inner join dbs on schemas.db = dbs.db_id inner join systems on dbs.system = systems.system_id where tables.table_id=' + req.params.tableId)
        .then(function(table) {
            res.json(table)
        })
})

router.get('/attributesByTableId/:tableId', function(req, res) {
    db.query('select * from attributes inner join tables on attributes.table_id = tables.table_id inner join "schemas" on tables.schema = schemas.schema_id inner join "dbs" on schemas.db = dbs.db_id inner join systems on dbs.system = systems.system_id where tables.table_id = ' + req.params.tableId + 'order by attributes.attr_id')
        .then(function(table) {
            res.json(table)
        })
})



router.get('/tableName/:table_name', function(req, res) {
    var query = "'" + req.params.table_name + "'"
    db.query('select * from tables inner join schemas on tables.schema = schemas.schema_id inner join dbs on schemas.db = dbs.db_id where tables.table_name =' + query)
        .then(function(tables) {
            res.json(tables)
        })
})

router.get('/attributesByName/:attr_name', function(req, res) {
    var query = "'" + req.params.attr_name + "'"
    db.query('select * from attributes inner join tables on tables.table_id = attributes.table_id inner join schemas on schemas.schema_id = tables.schema inner join dbs on dbs.db_id = schemas.db where attributes.attr_name = ' + query + 'order by attributes.attr_id')
        .then(function(attributes) {
            res.json(attributes)
        })
})


router.get('/attributesByIds', function(req, res) {
    db.query('select * from attributes inner join tables on attributes.table_id = tables.table_id inner join schemas on tables.schemas = schemas.schem_id inner join dbs on schemas.db = dbs.db_id where attributes.attr_id = any(' + req.body.attributes + ')')
        .then(function(attributes) {
            res.json(attributes)
        })
})



//POSTS
router.post('/systems', (req, res) => {
    req.body.system_name = `'${req.body.system_name}'`
    var keys = Object.keys(req.body)

    var values = []
    for (var key in req.body) {
        values.push(req.body[key])
    }
    keys = keys.join(',')
    values = values.join(',')
    db.query(`insert into systems (${keys}) values(${values})`).then(function(table) {
        res.sendStatus(200)
    })
})
router.post('/dbs', (req, res) => {
    req.body.db_name = `'${req.body.db_name}'`
    var keys = Object.keys(req.body)

    var values = []
    for (var key in req.body) {
        values.push(req.body[key])
    }
    keys = keys.join(',')
    values = values.join(',')
    db.query(`insert into dbs (${keys}) values(${values})`).then(function(table) {
        res.sendStatus(200)
    })
})
router.post('/schemas', (req, res) => {
    req.body.schema_name = `'${req.body.schema_name}'`
    var keys = Object.keys(req.body)

    var values = []
    for (var key in req.body) {
        values.push(req.body[key])
    }
    keys = keys.join(',')
    values = values.join(',')
    db.query(`insert into schemas (${keys}) values(${values})`).then(function(table) {
        res.sendStatus(200)
    })
})

router.post('/tables', function(req, res) {
    req.body.table_name = "'" + req.body.table_name + "'"
    var keys = Object.keys(req.body)

    var values = []
    for (var key in req.body) {
        values.push(req.body[key])
    }
    keys = keys.join(',')
    values = values.join(',')

    db.query('insert into tables (' + keys + ') values(' + values + ')').then(function(table) {
        res.sendStatus(200)
    })

})

router.post('/attributes/:tableId', function(req, res) {
    req.body.attr_name = `'${req.body.attr_name}'`
    req.body.datatype = `'${req.body.datatype}'`
    req.body.properties = `'{${req.body.properties.join(',')}}'`
    req.body.date_modified = `'${moment().format()}'`
    var keys = Object.keys(req.body)
    var values = []
    for (var key in req.body) {
        values.push(req.body[key])
    }
    keys = keys.join(',')
    values = values.join(',')
    db.query('insert into attributes (' + keys + ') values(' + values + ')').then(function(table) {
        res.sendStatus(200)
    })
})


//updates
router.post('/updateSystem/:system_id', function(req, res) {
    db.query(`update system set system_name=${req.body.system_name} where system.system_id = ${req.params.system_id}`)
        .then(function(system) {
            res.sendStatus(200)
        })
})
router.post('/updateDb/:db_id', function(req, res) {
    db.query(`update schema set system='${req.body.system}', db_name=${req.body.db_name} where db.db_id = ${req.params.db_id}`)
        .then(function(db) {
            res.sendStatus(200)
        })
})
router.post('/updateSchema/:schema_id', function(req, res) {
    db.query(`update schema set db='${req.body.db}', schema_name=${req.body.schema_name} where scheam.schema_id = ${req.params.schema_id}`)
        .then(function(schema) {
            res.sendStatus(200)
        })
})
router.post('/updateTable/:table_id', function(req, res) {
    db.query(`update table set schema='${req.body.schema}', table_name=${req.body.table_name},locked=${req.body.locked} where table.table_id = ${req.params.table_id}`)
        .then(function(table) {
            res.sendStatus(200)
        })
})

router.post('/updateAttribute/:attr_id', function(req, res) {
    db.query(`update attributes set datatype='${req.body.datatype}',properties='{${req.body.properties}}',pii=${req.body.pii},date_modified='${moment().format()}' where attributes.attr_id = ${req.params.attr_id}`)
        .then(function(attribute) {
            res.json(attribute)
        })
})



module.exports = router