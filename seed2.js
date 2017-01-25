"use strict	"
var fs = require('fs')
var path = require('path')
var parse = require('csv-parse');
var loc = path.join(__dirname, '/sample.csv')
var db = require('./server/db');
var Dbs = db.model('db')
var chalk = require('chalk');

var csvData = []
fs.createReadStream(loc)
    .pipe(parse({
        delimiter: ':'
    }))
    .on('data', csvrow => {
        csvData.push(csvrow)
    })
    .on('end', () => {
        organizeData(csvData)
    })

var organizeData = csvData => {
    var headers = csvData.shift()
    var dataObj = {}
    var systems = [{
            system_id: 1,
            system_name: "Bank"
        }, {
            system_id: 2,
            system_name: "Clients"
        }],
        dbs = [{
            db_id: 1,
            db_name: "banks",
            system: 1
        }, {
            db_id: 2,
            db_name: "clients",
            system: 2
        }],
        schemas = [{
            schema_id: 1,
            schema_name: "public",
            db: 1
        }, {
            schema_id: 2,
            schema_name: "public",
            db: 2
        }],
        tables = [],
        attributes = []
    headers[0].split(',').forEach(header => {
        dataObj[header] = []
    })
    var counter = 0
    csvData.forEach(row => {
        row = row[0].split(',')
        attributes.push({
            attr_id: ++counter,
            attr_name: row[1],
            datatype: row[2],
            table: row[0]
        })
        attributes.push({
            attr_id: ++counter,
            attr_name: row[7],
            datatype: row[8],
            table: row[6]
        })
        tables.push({
            table_name: row[0],
            schema: 1
        })
        tables.push({
            table_name: row[6],
            schema: 2
        })
    })
    tables = tables.filter(function(e) {
        return e.table_name
    })

    var arr = {};
    for (var i = 0, len = tables.length; i < len; i++)
        arr[tables[i].table_name] = tables[i];

    tables = new Array();
    for (var key in arr)
        tables.push(arr[key]);
    var tempTables = []
    tables.forEach(table => tempTables.push(table.table_name))
    attributes.forEach(attribute => attribute.table_id = tempTables.indexOf(attribute.table) + 1)

    seed(systems, dbs, schemas, tables, attributes)
}
var users = [{
    email: "admin@humantics.io",
    password: "humantics",
    power_level: 3
}, {
    email: "mapper@humantics.io",
    password: "humantics",
    power_level: 2
}, {
    email: "readOnly@humantics.io",
    password: "humantcs",
    power_level: 1
}]

var projects = [{
    project_name: "Bank to client Mapping",
    leader: 1,
    members: [1, 2],
    tables: [1, 4, 5, 8, 13]
}, {
    project_name: "Map reports",
    leader: 2,
    member: [1, 2, 3],
    tables: [2, 3, 6, 7, 9, 10, 11, 12]
}]
var mappings = [{
    version: 1,
    source: [1],
    target: 2,
    modifier: 1
}, {
    version: 1,
    source: [1],
    target: 5,
    modifier: 1
}, {
    version: 1,
    source: [1],
    target: 9,
    modifier: 1
}, {
    version: 1,
    source: [1],
    target: 16,
    modifier: 1
}, {
    version: 1,
    source: [5],
    target: 11,
    modifier: 1
}, {
    version: 1,
    source: [9],
    target: 31,
    modifier: 1
}, {
    version: 1,
    source: [31],
    target: 42,
    modifier: 1
}]
var seedProjects = () => {
    var creatingProjects = projects.map(project => {
        return db.model('project').create(project)
    })

    return Promise.all(creatingProjects)
}
var seedUsers = () => {
    var creatingUsers = users.map(user => {
        return db.model('user').create(user)
    })
    return Promise.all(creatingUsers)
}
var seedSystems = function(systems) {

    var creatingSys = systems.map(function(system) {
        return db.model('system').create(system)
    })
    return Promise.all(creatingSys)
}
var seedDbs = function(dbs) {
    var creatingDbs = dbs.map(function(db) {
        console.log(db)
        return Dbs.create(db)
    })
    return Promise.all(creatingDbs)
}
var seedSchemas = function(schemas) {
    var creatingSys = schemas.map(function(schema) {
        return db.model('schema').create(schema)
    })
    return Promise.all(creatingSys)
}
var seedTables = function(tables) {
    var creatingSys = tables.map(function(table) {
        return db.model('table').create(table)
    })
    return Promise.all(creatingSys)
}

var seedAttributes = function(attributes) {
    var creatingSys = attributes.map(function(attribute) {
        return db.model('attribute').create(attribute)
    })
    return Promise.all(creatingSys)
}

var seedMappings = function() {

    var creatingMappings = mappings.forEach(mapping => {
        return db.model('mapping').create(mapping)
    })
    return Promise.all(creatingMappings)
}
var seed = (systems, dbs, schemas, tables, attributes) => {
    db.sync({
            force: true
        })
    // .then(function() {
    //     console.log('users')
    //     return seedUsers()
    // })
        .then(function() {
            console.log('projects')
            return seedProjects()
        })
        .then(function() {
            console.log('systems')
            return seedSystems(systems)
        })
        .then(function() {
            console.log('dbs')
            return seedDbs(dbs);
        }).then(function() {
            return seedSchemas(schemas)
        })
        .then(function() {
            return seedTables(tables)
        })
        .then(function() {
            return seedAttributes(attributes)
        })
        // .then(function() {
        //     return seedMappings()
        // })
        .then(function() {
            console.log(chalk.green('Seed successful!'));
            process.exit(0);
        })
        .catch(function(err) {
            console.error(err);
            process.exit(1);
        });
}