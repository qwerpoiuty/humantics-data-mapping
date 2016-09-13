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
    dateModified: {
        type: Sequelize.DATE
    },
    modifier: {
        type: Sequelize.INTEGER
    },
    comments: {
        type: Sequelize.STRING
    },
    transformationRules: {
        type: Sequelize.ARRAY(Sequelize.STRING)
    }
})