var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('sourceSCHEMA', {
    name: {
        type: Sequelize.STRING
    },
    db: {
        type: Sequelize.INTEGER
    }
})