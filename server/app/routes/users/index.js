'use strict';
var router = require('express').Router();
var models = require('../../../db')
var chalk = require('chalk')


var ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
}


//FETCHES FOR DATA
router.get('/', function(req, res) {
    models.User.findAll({}).then(function(users) {
        res.json(users);
    });
});

router.get('/:id', function(req, res) {
    models.User.find({
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
    models.User.findById(req.body.id)
        .then(function(user) {
            return user.update(req.body)
        }).then(function(updatedUser) {
            res.json(updatedUser)
        })
})

module.exports = router;