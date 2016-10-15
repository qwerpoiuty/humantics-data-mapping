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

 var dbs = [{
        db_name: 'DB1',
        system: 1
    }, {
        db_name: 'DB2',
        system: 1
    }, {
        db_name: 'DB3',
        system: 1
    }]
var schemas = []
var tables = []
var attributes = []
var mappings = []
for(var i =1; i <=dbs.length;i++){
    var temp = [{
        schema_name: 'Schema1',
        db: i,
    }, {
        schema_name: 'Schema2',
        db: i,
    }, {
        schema_name: 'schema3',
        db: i,
    }]
    schemas = schemas.concat(temp)
}
for (var i = 1; i <= schemas.length; i++){
    var temp = [{
        table_name: 'Products',
        schema: i
    }, {
        table_name: 'Clients',
        schema: i
    }, {
        table_name: 'Sales',
        schema: i
    }]
    tables = tables.concat(temp)
}
for (var i = 1; i < tables.length; i++){
    var temp = [{
        attr_name: 'test_attr_1',
        table: i,
        datatype: 'float',
        date_modified: Date.now(),
    }, {
        attr_name: 'test_attr_2',
        table: i,
        datatype: 'int',
        date_modified: Date.now(),
    }, {
        attr_name: 'test_attr_3',
        table: i,
        datatype: 'string',
        date_modified: Date.now(),
    }, {
        attr_name: 'test_attr_4',
        table: i,
        datatype: 'long',
        date_modified: Date.now(),
    }, {
        attr_name: 'test_attr_5',
        table: i,
        datatype: 'boolean',
        date_modified: Date.now(),
    }]
    attributes = attributes.concat(temp)
}
var seedDbs = function() {
   
    var creatingDbs = dbs.map(function(db) {
        return Dbs.create(db)
    })
    return Promise.all(creatingDbs)
}
var seedSchemas = function() {

    var creatingSchemas = schemas.map(function(schema) {
        return db.model('schema').create(schema)
    })
    return Promise.all(creatingSchemas)
}
var seedTables = function() {
   
    var creatingTables = tables.map(function(table) {
        return db.model('table').create(table)
    })
    return Promise.all(creatingTables)
}

var seedAttributes = function() {

    var creatingAttributes = attributes.map(function(attribute) {
        return db.model('attribute').create(attribute)
    })
    return Promise.all(creatingAttributes)
}
var mappings = []
var seedMappings = function(){
    
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