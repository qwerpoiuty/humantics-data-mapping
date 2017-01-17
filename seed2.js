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
    var systems = [],
        dbs = [],
        schemas = [],
        tables = [],
        attributes = []
    headers[0].split(',').forEach(header => {
        dataObj[header] = []
    })
    csvData.forEach(row => {
        row = row[0].split(',')
        attributes.push({
            attr_name: row[1],
            datatype: row[2],
            table: row[0]
        })
        attributes.push({
            attr_name: row[7],
            datatype: row[8],
            table: row[6]
        })
        tables.push({
            table_name: row[0],
            schema: row[5]
        })
        tables.push({
            table_name: row[6],
            schema: row[5]
        })
        systems.push(row[5])
    })
    systems = Array.from(new Set(systems))
    systems = systems.filter(Boolean)

    tables = tables.filter(function(e) {
        return e.table_name
    })
    tables.forEach(table => {
        var index = systems.indexOf(table.schema) + 1
        table.schema = index
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

    var systemSeeds = []
    for (var i = 1; i < systems.length + 1; i++) {
        systemSeeds.push({
            system_name: systems[i]
        })
        dbs.push({
            db_name: systems[i],
            system: i
        })
        schemas.push({
            schema_name: "public",
            db: i
        })
    }
    seed(systemSeeds, dbs, schemas, tables, attributes)

    // for (var key in dataObj) {
    //     dataObj[key] = Array.from(new Set(dataObj[key]))
    // }

    // console.log(dataObj['SOURCE SYSTEM NAME'])

    // dataObj['SOURCE SYSTEM NAME'].forEach(name => {
    //     systems.push({
    //         id: systems.length,
    //         system_name: name,
    //     })
    // })
    // for (var i = 0; i < systems.length; i++) {
    //     dbs.push({
    //         db_name: systems[i].system_name,
    //         system: i
    //     })
    //     schemas.push({
    //         schema_name: "public",
    //         db: i
    //     })
    // }
    // dataObj["PDM TABLE NAME"].concat(dataObj["SOURCE TABLE NAME"]).forEach(table=>{
    //     tables.push({

    //     })
    // })
    // console.log(systems, tables)

    // console.log(systems, dbs, schemas)


    // seed(systems,dbs,schemas,tables,attributes)

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
var seed = (systems, dbs, schemas, tables, attributes) => {
    db.sync({
            force: true
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
        .then(function() {
            console.log(chalk.green('Seed successful!'));
            process.exit(0);
        })
        .catch(function(err) {
            console.error(err);
            process.exit(1);
        });
}