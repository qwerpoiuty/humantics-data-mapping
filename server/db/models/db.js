'use strict'
var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('db', {
    db_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    db_name: {
        type: Sequelize.STRING
    },
    system: {
        type: Sequelize.INTEGER
    }
}, {
    timestamps: false
})