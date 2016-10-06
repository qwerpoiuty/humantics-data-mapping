'use strict';
var router = require('express').Router();
var db = require('../../../db')
var chalk = require('chalk')

var User = db.model('user');


var ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
}


//FETCHES FOR DATA
router.get('/', function(req, res) {
    User.findAll({}).then(function(users) {
        res.json(users);
    });
});

router.get('/:id', function(req, res) {
    User.find({
        where: {
            id: req.params.id
        },
        include: [models.Dashboard]
    }).then(function(user) {
        res.json(user)
    })
})

//UPDATES FOR THINGS
router.put('/update', function(req, res) {
    req.body.completed = true
    User.findById(req.body.id)
        .then(function(user) {
            return user.update(req.body)
        }).then(function(updatedUser) {
            res.json(updatedUser)
        })
})

router.post('/signup', function(req, res){
    console.log('hello world', req.body.password)
    User.findOrCreate({
        where:{
            email: req.body.email
        },
            defaults: req.body
    }).spread(function(user, created){
        if(!created){
            res.json(false)
        }
        res.sendStatus(200)
    })
})

module.exports = router;