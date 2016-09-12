var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('sourceATTRIBUTE', {
    name: {
        type: Sequelize.STRING
    },
    table: {
        type: Sequelize.INTEGER
    },
    datatype: {
        type: Sequelize.STRING
    },
    dateModified: {
        type: Sequelize.DATE
    },
    openDate: {
        type: Sequelize.DATE
    },
    endDATE: {
        type: Sequelize.DATE
    }
})