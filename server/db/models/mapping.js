var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('mapping', {
    name: {
        type: Sequelize.STRING
    },
    source: {
        type: Sequelize.INTEGER
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
    comments: {
        type: Sequelize.STRING
    },
    transformation_rules: {
        type: Sequelize.ARRAY(Sequelize.STRING)
    }
})