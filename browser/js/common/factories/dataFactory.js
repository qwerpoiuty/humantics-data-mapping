app.factory('dataFactory', function($http) {
    var d = {}

    d.getSystems = function() {
        return ["IBM", "INTEL", "LINUX", "STUFF"]
    }

    d.getDatabases = function() {
        //this is going to be a get for database names
        return $http.get('/api/database/databases')
            .then(function(response) {
                return response.data
            })
    }

    d.getSchemas = function(dbID) {
        //this is going to accept a database as an argument and return a list of schemas
        var query = {
                dbs: dbID
            }
        return $http.get('/api/database/schemas', {
                params: query
            })
            .then(function(response) {
                return response.data
            })
    }

    d.getTables = function(schema_id) {
        //same thing. this is going to be a get function for tables depending on the schema
        var schema = {
                schema: schema_id
            }
        var query = schema
        return $http.get('/api/database/tables', {
                params: query
            })
            .then(function(response) {
                return response.data
            })
    }

    d.getAttributesByTableId = function(tableId){
        return $http.get('/api/database/tableById/' + tableId)
            .then(function(response){
                return response.data
            })
    }

    d.getTablesByName = function(tableName){
        return $http.get('/api/database/tableName/' + tableName)
            .then(function(response){
                return response.data
            })
    }

    d.getTablesByAttribute = function(attributeName){
        return $http.get('/api/database/tablesAttribute/' + attributeName)
            .then(function(response){
                return response.data
            })
    }

    d.getImpactByTable = function(tableId){
        console.log(tableId)
        return $http.get('/api/mappings/impact/table/' + tableId)
            .then(function(response){
                console.log(response.data)
                return response.data
            })
    }

    d.getImpactByAttribute = function(attr_id){
        return $http.get('/api/mappings/impact/attribute/' + attr_id)
            .then(function(response){
                return response.data
            })
    }

    d.createSystem = function(system) {
        var system = {
            db_name: 'testDb',
            schemas: [1, 2, 3]
        }
        return $http.post('/api/database/system', system).then(function(response) {
            return response.data
        })
    }
    d.searchTables = function(search) {
        return $http.get('/api/database/searchtables', search)
            .then(function(response) {
                return response.data
            })
    }
    d.createTable = function(table) {
        var query = table
        return $http.post('/api/tables', {params: query}).then(function(response) {
            return response.data
        })
    }
    d.getMapping = function(target) {
        var query = {attr_id:target}
        return $http.get('/api/mappings', {params:query}).then(function(response) {
            return response.data
        })
    }
    d.updateMapping = function(mapping) {
        return $http.put('/api/mappings', mapping).then(function(response) {
            return response.data
        })
    }
    d.createMapping = function(mapping) {
        var mapping = {
            name:'test_mapping_1',
            source: 3,
            target: 1,
            date_modified: Date.now(),
            modifier:1
        }
        return $http.post('/api/mappings', mapping).then(function(response) {
            return response.data
        })
    }
    return d
})