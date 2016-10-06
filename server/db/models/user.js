'use strict';
var bcrypt = require('bcrypt');
var _ = require('lodash');
var Sequelize = require('sequelize');

var chalk = require('chalk')

var db = require('../_db');

module.exports = db.define('user', {
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    salt: {
        type: Sequelize.STRING
    },
    mappings: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
    }
}, {
    instanceMethods: {
        sanitize: function() {
            return _.omit(this.toJSON(), ['password', 'salt']);
        },
        correctPassword: function(candidatePassword) {
            console.log(chalk.yellow("hellow"))
            return bcrypt.compareSync(candidatePassword, this.password, this.salt);
        }
    },
    hooks: {
        beforeCreate: function(user) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(user.password, salt);
            user.salt = salt;
            user.password = hash; 
        }
    }
});