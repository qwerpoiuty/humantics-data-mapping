'use strict';
var router = require('express').Router();
var db = require('../../../db')
var Project = db.model('project')

var chalk = require('chalk')


var ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
}

router.get('/', function(req, res) {
    db.query('SELECT project_id, project_name, email,members,tables,project_status,due_date FROM projects inner join users on projects.leader= users.id order by projects.project_id asc')
        .then(function(projects) {
            res.json(projects)
        })
})

router.get('/:id', function(req, res) {
    db.query(`SELECT leader, members, project_name, project_id, schema_name, table_name, table_id, table_status, project_status, db_name FROM projects INNER JOIN tables on tables.table_id = any(projects.tables) inner join schemas on tables.schema = schemas.schema_id inner join dbs on schemas.db = dbs.db_id WHERE projects.project_id = + ${req.params.id} order by projects.project_id desc`)
        .then(function(projects) {
            res.json(projects)
        })
})

router.post('/updateProject', (req, res) => {
    db.query(`update projects set tables= ${req.body.column} || '{${req.body.values.join(',')}}' where projects.project_id = ${req.body.id}`).then(project => {
        res.sendStatus(200)
    })
})

router.post('/custom', (req, res) => {
    var string = "select * from tables inner join schemas on tables.schema = schemas.schema_id inner join dbs on schemas.db = dbs.db_id"
    if (req.body.query) string = string + " where " + req.body.query
    db.query(string).then(results => {
        res.json(results)
    })
})

router.post('/', function(req, res) {
    req.body.project_name = "'" + req.body.project_name + "'"
    req.body.due_date = "'" + req.body.due_date + "'"
    var keys = Object.keys(req.body)
    var values = []
    for (var key in req.body) {
        values.push(req.body[key])
    }
    keys = keys.join(',')
    values = values.join(',')
    db.query('insert into projects (' + keys + ') values(' + values + ')').then(function(table) {
        res.sendStatus(200)
    })
})



module.exports = router;