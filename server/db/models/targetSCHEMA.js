var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('targetSCHEMA', {
    name: {
        type: Sequelize.STRING
    },
    db: {
        type: Sequelize.INTEGER
    }
})