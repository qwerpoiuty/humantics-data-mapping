var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('sourceDB', {
    name: {
        type: Sequelize.STRING
    }
})