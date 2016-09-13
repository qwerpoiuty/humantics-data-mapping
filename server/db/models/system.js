var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('system', {
    name: {
        type: Sequelize.STRING
    },
    //both targets and sources will be json strings of db/schema/table/attribute combos
    db_platform: {
        type: Sequelize.ARRAY(Sequelize.STRING)
    },
    mappings: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
    }

})