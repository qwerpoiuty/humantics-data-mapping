'use strict';
var router = require('express').Router();
var db = require('../../../db')
var Mapping = db.model('mapping')
var chalk = require('chalk')
var Promise = require('bluebird');

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
    db.query('select * from tables a inner join attributes b on b.table_id = a.table_id inner join mappings c on c.target = b.attr_id where ' + req.params.attr_id + '= any(c.source)')
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
    var tree = []
    let promises = []
    let thenable = {
        then: function(resolve) {
            resolve(tree)
            throw new TypeError("throwing")
        }
    }


    let promise = Promise.resolve(thenable)
    let findChildren = parents => {
        let promises = []
        parents.forEach(parent => {
            let childPromise = new Promise((resolve, reject) => {
                if (!parent) {
                    resolve()
                } else {
                    db.query("select table_name, schema_name, target from tables inner join attributes on attributes.table_id = tables.table_id inner join schemas on tables.schema = schemas.schema_id inner join mappings on attributes.attr_id = any(mappings.source) where tables.table_id = " + parent).then(attributes => {
                        attributes = attributes[0]
                        var children = attributes.map(e => {
                            return e.target
                        })
                        db.query("select schema_name, tables.table_id,table_name from attributes inner join tables on attributes.table_id = tables.table_id inner join schemas on tables.schema = schemas.schema_id where attributes.attr_id = any('{" + children.join(',') + "}')").then(function(attributes) {
                            attributes = attributes[0]
                            if (attributes === undefined) return resolve()
                            let tables = addToTree(attributes, parent)
                            var children = tables.map(e => {
                                return e.table_id
                            })
                            if (children.length == 0) {
                                resolve()
                            } else {
                                return findChildren(children)
                            }
                        })
                    })
                }
            })
            promises.push(childPromise)
        })
        Promise.all(promises).then(() => {
            res.json(tree)
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
                name: attributes[i].schema_name + "." + attributes[0].table_name,
                parent: parent
            })
        }
        return child_tables
    }
    db.query('select table_name, schema_name, target from tables inner join attributes on attributes.table_id = tables.table_id inner join schemas on tables.schema = schemas.schema_id inner join mappings on attributes.attr_id = any(mappings.source) where tables.table_id = ' + req.params.table_id).then(attributes => {
        attributes = attributes[0]
        tree.push({
            id: req.params.table_id,
            name: attributes[0].schema_name + '.' + attributes[0].table_name,
        })
        var children = attributes.map(e => {
            return e.target
        })
        db.query("select schema_name, tables.table_id,table_name from attributes inner join tables on attributes.table_id = tables.table_id inner join schemas on tables.schema = schemas.schema_id where attributes.attr_id = any('{" + children.join(',') + "}')").then(attributes => {
            var tables = addToTree(attributes[0], req.params.table_id)
            var children = attributes[0].map(e => {
                return e.table_id
            })
            return findChildren(children)
        })
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