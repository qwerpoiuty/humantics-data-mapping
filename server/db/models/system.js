var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('system', {
    system_name: {
        type: Sequelize.STRING
    },
    db_platform: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
    }

})