var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('schema', {
    schema_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    schema_name: {
        type: Sequelize.STRING
    },
    db: {
        type: Sequelize.INTEGER
    },
    tables: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
    }
})