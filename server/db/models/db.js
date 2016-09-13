'use strict'
var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('db', {
    name: {
        type: Sequelize.STRING
    },
    schemas: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
    }
})