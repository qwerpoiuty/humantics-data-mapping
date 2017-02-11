'use strict';
var router = require('express').Router();
var db = require('../../../db')
var chalk = require('chalk')
var bcrypt = require('bcrypt');

var User = db.model('user');


var ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
}
router.get('/', (req, res) => {
    db.query(`select id,email,power_level from users`).then(users => {
        res.json(users)
    })
})


//UPDATES FOR THINGS
router.put('/update', function(req, res) {
    var user = {
        email: req.body.email,
        password: req.body.password,
        power_level: req.body.power_level.level
    }
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(user.password, salt);
    user.salt = salt;
    user.password = hash;
    db.query(`update users set password='${user.password}', salt='${user.salt}', power_level=${user.power_level} where users.email = '${user.email}'`).then(user => {
        res.sendStatus(200)
    })
})

router.post('/signup', function(req, res) {
    var user = {
        email: req.body.email,
        password: req.body.password,
        power_level: req.body.power_level.level
    }
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(user.password, salt);
    user.salt = salt;
    user.password = hash;
    db.query(`insert into users (email,password,salt,power_level) values ('${user.email}', '${user.password}', '${user.salt}', ${user.power_level})`).then(user => {
        res.json(user)
    })
})

module.exports = router;