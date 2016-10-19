var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('system', {
    system_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    system_name: {
        type: Sequelize.STRING
    },
    db_platform: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
    }

}, {
    timestamps: false
})