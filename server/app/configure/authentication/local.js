'use strict';
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var chalk = require('chalk');
var _ = require('lodash');

module.exports = function(app, db) {

    var User = db.model('user');

    // When passport.authenticate('local') is used, this function will receive
    // the email and password to run the actual authentication logic.
    var strategyFn = function(email, password, done) {
        User.findOne({
                where: {
                    email: email
                }
            })
            .then(function(user) {
                // user.correctPassword is a method from the User schema.
                var notFound = {
                    notFound: true
                }

                if (!user) done(null, notFound)
                else if (!bcrypt.compareSync(password, user.password, user.salt)) {
                    done(null, false);
                } else {
                    // Properly authenticated.
                    done(null, user);
                }
            })
            .catch(done);
    };

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, strategyFn));

    app.post('/lock', function(req, res, next) {
        db.query(`update users set locked = true where users.email = '${req.body.email}'`).then(() => {
            res.sendStatus(200)
        })
    })

    // A POST /login route is created to handle login.
    app.post('/login', function(req, res, next) {

        var authCb = function(err, user) {

            if (err) return next(err);
            if (user.notFound) {
                var error = new Error('User not found')
                error.status = 404
                return next(error)
            } else if (!user) {
                var error = new Error('Invalid login credentials.');
                error.status = 401;
                return next(error);
            }
            if (user.locked) {
                var error = new Error('Locked');
                error.status = 400;
                return next(error)
            }
            // req.logIn will establish our session.
            req.logIn(user, function(loginErr) {
                console.log(chalk.red(loginErr))
                if (loginErr) return next(loginErr);

                // We respond with a response object that has user with _id and email.
                res.status(200).send({
                    user: _.omit(user.toJSON(), ['password', 'salt'])
                });
            });

        };

        passport.authenticate('local', authCb)(req, res, next);

    });


};