var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('targetDB', {
    name: {
        type: Sequelize.STRING
    }
})