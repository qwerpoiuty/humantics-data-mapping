/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var chalk = require('chalk');
var db = require('./server/db');
var User = db.model('user');
var Dbs = db.model('db')
var Promise = require('sequelize').Promise;

// var seedUsers = function () {

//     var users = [
//         {
//             email: 'testing@fsa.com',
//             password: 'password'
//         },
//         {
//             email: 'obama@gmail.com',
//             password: 'potus'
//         }
//     ];

//     var creatingUsers = users.map(function (userObj) {
//         return User.create(userObj);
//     });

//     return Promise.all(creatingUsers);

// };
var seedDbs = function() {
    var dbs = [{
        db_name: 'test_db_1',
        schemas: [1],
        system: 1
    }, {
        db_name: 'test_db_2',
        schemas: [2],
        system: 1
    }, {
        db_name: 'test_db_3',
        schemas: [3],
        system: 1
    }, {
        db_name: 'test_db_4',
        schemas: [4],
        system: 1
    }, {
        db_name: 'test_db_5',
        schemas: [5],
        system: 1
    }]
    var creatingDbs = dbs.map(function(db) {
        return Dbs.create(db)
    })
    return Promise.all(creatingDbs)
}
var seedSchemas = function() {
    var schemas = [{
        schema_name: 'test_schema_1',
        db: 1,
        tables: [1]
    }, {
        schema_name: 'test_schema_2',
        db: 2,
        tables: [2]
    }, {
        schema_name: 'test_schema_3',
        db: 3,
        tables: [3]
    }, {
        schema_name: 'test_schema_4',
        db: 4,
        tables: [4]
    }, {
        schema_name: 'test_schema_5',
        db: 5,
        tables: [5]
    }]

    var creatingSchemas = schemas.map(function(schema) {
        return db.model('schema').create(schema)
    })
    return Promise.all(creatingSchemas)
}
var seedTables = function() {
    var tables = [{
        table_name: 'test_table_1',
        schema: 1,
        columns: [1]
    }, {
        table_name: 'test_table_2',
        schema: 2,
        columns: [2]
    }, {
        table_name: 'test_table_3',
        schema: 3,
        columns: [3]
    }, {
        table_name: 'test_table_4',
        schema: 4,
        columns: [4]
    }, {
        table_name: 'test_table_5',
        schema: 5,
        columns: [5]
    }]
    var creatingTables = tables.map(function(table) {
        return db.model('table').create(table)
    })
    return Promise.all(creatingTables)
}

var seedAttributes = function() {
    var attributes = [{
        attr_name: 'test_attr_1',
        table: 1,
        datatype: 'float',
        date_modified: Date.now(),
    }, {
        attr_name: 'test_attr_2',
        table: 2,
        datatype: 'float',
        date_modified: Date.now(),
    }, {
        attr_name: 'test_attr_3',
        table: 3,
        datatype: 'float',
        date_modified: Date.now(),
    }, {
        attr_name: 'test_attr_4',
        table: 4,
        datatype: 'float',
        date_modified: Date.now(),
    }, {
        attr_name: 'test_attr_5',
        table: 5,
        datatype: 'float',
        date_modified: Date.now(),
    }]

    var creatingAttributes = attributes.map(function(attribute) {
        return db.model('table').create(attribute)
    })
    return Promise.all(creatingAttributes)
}

db.sync({
    force: true
})
    .then(function() {
        return seedDbs();
    }).then(function() {
        return seedSchemas()
    })
    .then(function() {
        return seedTables()
    })
    .then(function() {
        return seedAttributes()
    })
    .then(function() {
        console.log(chalk.green('Seed successful!'));
        process.exit(0);
    })
    .catch(function(err) {
        console.error(err);
        process.exit(1);
    });