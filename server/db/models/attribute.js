var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('attribute', {
    attr_name: {
        type: Sequelize.STRING
    },
    table: {
        type: Sequelize.INTEGER
    },
    datatype: {
        type: Sequelize.STRING
    },
    date_modified: {
        type: Sequelize.DATE
    },
    open_date: {
        type: Sequelize.DATE
    },
    end_date: {
        type: Sequelize.DATE
    }
})