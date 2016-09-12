var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('targetATTRIBUTE', {
    name: {
        type: Sequelize.STRING
    },
    table: {
        type: Sequelize.INTEGER
    }
})