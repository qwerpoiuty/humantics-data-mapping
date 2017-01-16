'use strict'
var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('task', {
    task_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    task_name: {
        type: Sequelize.STRING
    },
    owner: {
        type: Sequelize.INTEGER
    },
    description: {
        type: Sequelize.JSON
    },
    due_date: {
        type: Sequelize.DATE
    },
    task_status: {
        type: Sequelize.ENUM('Complete', 'Incomplete', 'Pending Review')
    }
}, {
    timestamps: false
})