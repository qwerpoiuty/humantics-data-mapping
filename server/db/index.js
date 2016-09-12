'use strict';
var db = require('./_db');
module.exports = db;

var User = require('./models/user');
var Mapping = require('./models/mapping')
var sourceATTRIBUTE = requre('/models/sourceATTRIBUTE')
var sourceDB = requre('/models/sourceDB')
var sourceSCHEMA = requre('/models/sourceSCHEMA')
var sourceTABLE = requre('/models/sourceTABLE')
var targetATTRIBUTE = requre('/models/targetATTRIBUTE')
var targetDB = requre('/models/targetDB')
var targetSCHEMA = requre('/models/targetSCHEMA')
var targetTABLE = requre('/models/targetTABLE')