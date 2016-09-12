var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('sourceTable', {
    name: {
        type: Sequelize.STRING
    },
    schema: {
        type: Sequelize.INTEGER
    }
})