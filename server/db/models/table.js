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
    table_business_name: {
        type: Sequelize.STRING
    },
    comments: {
        type: Sequelize.JSON
    },
    table_status: {
        type: Sequelize.ENUM("Incomplete", "Pending Review", "Pending Approval", "Approved"),
        defaultValue: "Incomplete"
    },
    locked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: false
})