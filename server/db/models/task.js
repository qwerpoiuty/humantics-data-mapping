'use strict'
var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('task', {
	task_id:{
		 type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
    task_name: {
        type: Sequelize.STRING
    },
    mapper: {
        type: Sequelize.INTEGER
    },
    attrs: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
    },
    status: {
    	type: Sequelize.ENUM('Complete', 'Incomplete', 'Pending Review')
    }
})