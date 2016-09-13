'use strict'
var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('db', {
    db_name: {
        type: Sequelize.STRING
    },
    system: {
        type: Sequelize.INTEGER
    },
    schemas: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
    }
})