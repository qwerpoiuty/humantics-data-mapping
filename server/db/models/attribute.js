var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('attribute', {
    attr_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    attr_name: {
        type: Sequelize.STRING
    },
    table: {
        type: Sequelize.INTEGER
    },
    datatype: {
        type: Sequelize.STRING
    },
    date_created: {
        type: Sequelize.DATE
    },
    open_date: {
        type: Sequelize.DATE
    },
    end_date: {
        type: Sequelize.DATE
    }
})