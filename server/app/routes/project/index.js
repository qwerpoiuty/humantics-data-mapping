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
    db.query('SELECT * FROM projects order by projects.project_id asc')
        .then(function(projects) {
            res.json(projects)
        })
})

router.get('/:id', function(req, res) {
    db.query(`SELECT * FROM projects INNER JOIN tables on tables.table_id = any(projects.tables) WHERE projects.project_id = + ${req.params.id} order by projects.project_id desc`)
        .then(function(projects) {
            res.json(projects)
        })
})

router.post('/addTablesThroughQuery', (req, res) => {
    db.query(req.body.query).then((tables) => {
        tables = tables[0]
        tables = tables.map(e => {
            return e.table_id
        })
        db.query(`update projects set tables= tables || '{${tables.join(',')}}' where projects.project_id = ${req.body.project}`).then(project => {
            res.sendStatus(200)
        })
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