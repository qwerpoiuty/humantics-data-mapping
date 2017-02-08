'use strict';
var router = require('express').Router();
var db = require('../../../db')
var Mapping = db.model('mapping')
var chalk = require('chalk')
var Promise = require('bluebird');
var moment = require('moment')

var ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
}

let systemLink = `inner join systems on systems.system_id = dbs.system`
let dbLink = `inner join dbs on db.db_id = schemas.db`
let schemaLink = `inner join schemas on schemas.schema_id = tables.schema`
let tableLink = `inner join tables on tables.table_id = attributes.table_id`
let attrTargetLink = `inner join attributes on attributes.attr_id = mappings.target`
let attrSourceLink = `inner join attributes on attributes.attr_id = any(mappings.source)`
let attrLink = `inner join attributes on attributes.table_id = tables.table_id`


router.get('/', function(req, res) {
    db.query(`select * from mappings ${attrSourceLink} ${tableLink} ${schemaLink} ${dbLink} ${systemLink} where mappings.target = ${req.query.attr_id} order by a.version desc`).then(mappings => res.json(mappings))
})

router.get('/recentMapping', function(req, res) {

    db.query('select * from mappings a inner join attributes b on b.attr_id = any(a.source) inner join tables as c on b.table_id = c.table_id inner join schemas d on c.schema = d.schema_id inner join dbs as e on d.db = e.db_id inner join systems on e.system = systems.system_id where a.target=' + req.query.attr_id + ' order by a.version desc')
        .then(function(mappings) {
            if (mappings[0].length == 1) {
                res.json(mappings[0])
            } else if (mappings[0].length > 1) {
                var currentVersion = mappings[0][0].version
                var sent = false
                for (var i = 0; i < mappings[0].length; i++) {
                    if (mappings[0][i].version != currentVersion) {
                        res.json(mappings[0].slice(0, i))
                        sent = true
                        break
                    }
                }
                if (sent === false) res.json(mappings[0])
            } else {
                res.sendStatus(200)
            }
        })
})

router.get('/all/:table_id', (req, res) => {
    db.query(`select 
  a.version, a.target, a.mapping_status,
  b1.attr_name as target_attr_name,
  b1.datatype as target_datatype,
  b2.attr_name as source_attr_name,
  b2.datatype as source_datatype,
  c1.table_name as target_table,
  c2.table_name as source_table,
  d2.schema_name as source_schema,
  e2.db_name as source_db,
  f2.system_name as source_system
from mappings as a 
inner join attributes as b1
  on a.target = b1.attr_id
inner join tables as c1
  on b1.table_id = c1.table_id
inner join schemas as d1
  on c1.schema = d1.schema_id
inner join dbs as e1
  on d1.db = e1.db_id
inner join systems as f1
  on e1.system = f1.system_id
inner join attributes as b2
  on b2.attr_id = any(a.source)
inner join tables as c2
  on b2.table_id = c2.table_id
inner join schemas as d2
  on c2.schema = d2.schema_id
inner join dbs as e2
  on d2.db = e2.db_id
inner join systems as f2
  on e2.system = f2.system_id
where b1.table_id = ${req.params.table_id}`).then(mappings => {
        res.json(mappings)
    })
})

router.get('/impact/attribute/:attr_id', function(req, res) {
    db.query(`select * from tables a 
        inner join attributes b on b.table_id = a.table_id 
        inner join mappings c on c.target = b.attr_id 
        inner join schemas on a.schema = schemas.schema_id
        inner join dbs on dbs.db_id = schemas.db
        where ${req.params.attr_id} = any(c.source) and c.mapping_status = 'Approved'`)
        .then(function(mappings) {
            res.json(mappings)
        })
})

router.get('/impact/table/:table_id', function(req, res) {
    db.query('select * from tables inner join attributes on attributes.table_id = tables.table_id inner join mappings on attributes.attr_id = any(mappings.source) where tables.table_id =' + req.params.table_id)
        .then(function(mappings) {
            var seen = {}
            var out = []
            var j = 0
            for (var i = 0; i < mappings[0].length; i++) {
                var item = mappings[0][i].table_id
                if (seen[item] !== 1) {
                    seen[item] = 1;
                    out[j++] = mappings[0][i]
                }
            }
            res.json(out)
        })
})



router.get('/impact/tree/:table_id', function(req, res) {
    //gets the children of a node given a tableId
    let tree = []
    let promises = []
    let thenable = {
        then: resolve => {
            resolve(tree)
            throw new TypeError("throwing")
        }
    }


    let promise = Promise.resolve(thenable)
    let promiseCount = 0
    let iterations = 0
    let findChildren = parents => {
        var promisesArray = parents.map(parent => {
            promiseCount++
            let promises = []
            let childPromise = new Promise((resolve, reject) => {
                db.query(`SELECT * from tables c
inner join attributes b
 on b.table_id = c.table_id
inner join mappings a1
 on b.attr_id = any(a1.source)
inner join schemas d
 on d.schema_id = c.schema
inner join dbs e
 on d.db = e.db_id
WHERE a1.date_modified = 
  (SELECT max(date_modified) FROM mappings a2 WHERE a2.target = a1.target)
and a1.mapping_status = 'Approved'
and c.table_id = ${parent}`).then(attributes => {
                    attributes = attributes[0]
                    let a = () => [...new Set(attributes.map(e => {
                        return e.target
                    }))]
                    var children = a()
                    if (children.length == 0) {
                        promiseCount--
                        resolve()
                    }
                    db.query(`select schema_name, tables.table_id,table_name from attributes ${tableLink} ${schemaLink}  where attributes.attr_id = any('{${children.join(',')}}')`).then(function(attributes) {
                        attributes = attributes[0]
                        if (attributes.length === 0) {
                            promiseCount--
                            return resolve()
                        }
                        let tables = addToTree(attributes, parent)
                        let a = () => [...new Set(attributes.map(e => {
                            return e.table_id
                        }))]
                        let children = a()
                        iterations++
                        if (iterations > 4) {
                            promiseCount--
                            resolve()
                            return
                        }
                        return findChildren(children)
                    })
                })
            })
            promises.push(childPromise)
            return Promise.all(promises)
        })
        Promise.all(promisesArray).then(() => {
            if (promiseCount <= 1) {
                res.json(tree)

            }
        })
    }

    let addToTree = (attributes, parent) => {
        var flags = {},
            child_tables = []
        for (var i = 0; i < attributes.length; i++) {
            if (flags[attributes[i].table_id]) continue;
            flags[attributes[i].table_id] = true;
            child_tables.push(attributes[i].table_id);
            tree.push({
                id: attributes[i].table_id,
                name: attributes[i].schema_name + "." + attributes[i].table_name,
                parent: parent
            })
        }
        return child_tables
    }
    db.query(`SELECT * from tables c
inner join attributes b
 on b.table_id = c.table_id
inner join mappings a1
 on b.attr_id = any(a1.source)
inner join schemas d
 on d.schema_id = c.schema
inner join dbs e
 on d.db = e.db_id
WHERE a1.date_modified = 
  (SELECT max(date_modified) FROM mappings a2 WHERE a2.target = a1.target)
and a1.mapping_status = 'Approved'
and c.table_id = ${req.params.table_id}`).then(attributes => {
        attributes = attributes[0]
        tree.push({
            id: req.params.table_id,
            name: attributes[0].schema_name + '.' + attributes[0].table_name,
        })
        let a = () => [...new Set(attributes.map(e => {
            return e.target
        }))]

        let children = a()

        db.query("select schema_name, tables.table_id,table_name from attributes inner join tables on attributes.table_id = tables.table_id inner join schemas on tables.schema = schemas.schema_id where attributes.attr_id = any('{" + children.join(',') + "}')").then(attributes => {
            var tables = addToTree(attributes[0], req.params.table_id)
            var children = attributes[0].map(e => {
                return e.table_id
            })
            findChildren(children)
        })
    })


})

router.post('/', function(req, res) {
    console.log(req.body.source)
    req.body.source = "'{" + req.body.source.join(',') + "}'"
    req.body.date_modified = `'${moment().format()}'`
    req.body.transformation_rules = "'" + JSON.stringify(req.body.transformation_rules) + "'"
    req.body.comments = `'${JSON.stringify(req.body.comments)}'`
    if (req.body.hasOwnProperty('mapping_status')) {
        req.body.mapping_status = `'${req.body.mapping_status}'`
    }
    var keys = Object.keys(req.body)
    var values = []
    for (var key in req.body) {
        values.push(req.body[key])
    }
    keys = keys.join(',')
    values = values.join(',')

    db.query(`insert into mappings(${keys}) values(${values})`)
        .then(function(mapping) {
            res.sendStatus(200)
        })
})


router.post('/changeStatus', function(req, res) {
    db.query(`update mappings set mapping_status= '${req.body.status}' where mappings.target = ${req.body.id} and mappings.version =${req.body.version}`).then(function() {
        res.sendStatus(200)
    })

})


module.exports = router