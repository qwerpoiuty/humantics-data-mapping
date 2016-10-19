'use strict';
var router = require('express').Router();
var db = require('../../../db')
var Project = project.model('project')

var chalk = require('chalk')


var ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
}

router.get('/:id', function(req,res){
	db.query('SELECT * FROM projects INNER JOIN tasks on tasks.task_id = any(projects.tasks) WHERE projects.project_id =' + req.params.id)
		.then(function(projects){
			res.json(projects)
	})
})

router.get('/projects', function(req,res){
	db.query('SELECT * FROM projects INNER JOIN users on users.id = any(projects.members) WHERE users.id =' + req.query.id)
		.then(function(projects){
			res.json(projects)
		})
})


