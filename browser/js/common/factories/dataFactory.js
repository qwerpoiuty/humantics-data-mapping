app.factory('dataFactory', function($http) {
    var d = {}
    d.getDatabases = function() {
        //this is going to be a get for database names
        return ["Customers", "Sales", "Banks", "Marketing"]
    }

    d.getSchemas = function(db) {
        //this is going to accept a database as an argument and return a list of schemas
        return ["Schema1", "s2", "s3", "s4"]
    }

    d.getTables = function(dbschema) {
        //same thing. this is going to be a get function for tables depending on the schema
        return $http.get('/api/database/tables', dbschema)
            .then(function(response) {
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
        // return $http.post('/api/table', table).then(function(response){
        //     return response.data
        // })
    }
    d.getMapping = function(db) {


        // return $http.get('/api/mappings', db).then(function(response) {
        //     return response.data
        // })
    }
    d.updateMapping = function(mapping) {

        // return $http.put('/api/mappings', mapping).then(function(response){
        //     return response.data
        // })
    }
    d.createMapping = function(mapping) {
        return $http.post('/api/mappings', mapping).then(function(response) {
            return response.data
        })
    }
    return d
})