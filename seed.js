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
"use strict"
var chalk = require('chalk');
var db = require('./server/db');
var User = db.model('user');
var Dbs = db.model('db')
var Promise = require('sequelize').Promise;
var parse = require('csv-parse');
var loc = path.join(__dirname, '/sample.csv')

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
    headers[0].split(',').forEach(header => {
        dataObj[header] = []
    })
    csvData.forEach(row => {
        row = row[0].split(',')
        for (var key in dataObj) {
            dataObj[key].push(row.shift())
        }
    })

}
var seedSystems = function() {

    var creatingSys = systems().map(function(system) {
        return db.model('system').create(system)
    })
    return Promise.all(creatingSys)
}

var seedDbs = function() {

    var creatingDbs = databases().map(function(db) {
        return Dbs.create(db)
    })
    return Promise.all(creatingDbs)
}
var seedSchemas = function() {

    var creatingSchemas = schemas().map(function(schema) {
        return db.model('schema').create(schema)
    })
    return Promise.all(creatingSchemas)
}
var seedTables = function() {

    var creatingTables = tables().map(function(table) {
        return db.model('table').create(table)
    })
    return Promise.all(creatingTables)
}

var seedAttributes = function() {

    var creatingAttributes = attributes().map(function(attribute) {
        return db.model('attribute').create(attribute)
    })
    return Promise.all(creatingAttributes)
}

db.sync({
        force: true
    }).then(function() {
        return seedSystems()
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