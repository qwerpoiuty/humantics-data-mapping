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
    status: {
        type: Sequelize.ENUM("incomplete", "pending", "complete"),
        defaultValue: "incomplete"
    },
    target: {
        type: Sequelize.INTEGER
    },
    date_created: {
        type: Sequelize.DATE
    },
    modifier: {
        type: Sequelize.INTEGER
    },
    comments: {
        type: Sequelize.STRING
    },
    transformation_rules: {
        type: Sequelize.ARRAY(Sequelize.STRING)
    }
}, {
    hooks: {
        beforeCreate: function(mapping) {
            mapping.date_created = new Date().toISOString().slice(0, 19).replace('T', ' ');
        }
    }
})