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

router.get('/', function(req,res){
	console.log("hello")
	db.query('SELECT * FROM projects INNER JOIN users on users.id = projects.leader')
		.then(function(projects){
			res.json(projects)
		})
})

router.get('/:id', function(req,res){
	db.query('SELECT * FROM projects INNER JOIN tables on tables.table_id = any(projects.tables) WHERE projects.project_id =' + req.params.id)
		.then(function(projects){
			res.json(projects)
	})
})



module.exports = router;


