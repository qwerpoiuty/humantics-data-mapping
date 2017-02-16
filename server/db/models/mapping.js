var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('mapping', {
    mapping_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    version: {
        type: Sequelize.INTEGER
    },
    source: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
    },
    target: {
        type: Sequelize.INTEGER
    },
    date_modified: {
        type: Sequelize.DATE
    },
    modifier: {
        type: Sequelize.INTEGER
    },
    notes: {
        type: Sequelize.JSON
    },
    transformation_rules: {
        type: Sequelize.JSON
    }
}, {
    timestamps: false
})