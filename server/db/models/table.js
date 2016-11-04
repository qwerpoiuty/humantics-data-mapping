var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('table', {
    table_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    table_name: {
        type: Sequelize.STRING
    },
    schema: {
        type: Sequelize.INTEGER
    },
    columns: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
    },
    table_status: {
        type: Sequelize.ENUM('incomplete', 'pending', 'complete'),
        defaultValue: 'incomplete'
    }
}, {
    timestamps: false
})