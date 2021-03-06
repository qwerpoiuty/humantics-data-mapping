'use strict'
var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('project', {
    project_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    project_name: {
        type: Sequelize.STRING
    },
    leader: {
        type: Sequelize.INTEGER
    },
    members: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
    },
    tables: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
    },
    tasks: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
    },
    project_status: {
        type: Sequelize.STRING,
        defaultValue: "Incomplete"
    },
    due_date: {
        type: Sequelize.DATE
    }
}, {
    timestamps: false
})