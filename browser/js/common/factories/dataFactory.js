app.factory('dataFactory', function($http) {
    var d = {}

    //high level gets
    d.getSystems = function() {
        return $http.get(`/api/database/systems`)
            .then(response => {
                return response.data
            })
    }

    d.getDatabases = function(system_id) {
        //this is going to be a get for database names
        var query = {
            system: system_id
        }
        return $http.get('/api/database/databases', {
                params: query
            })
            .then(function(response) {
                return response.data
            })
    }

    d.getSchemas = function(db_id) {
        //this is going to accept a database as an argument and return a list of schemas
        var query = {
            db: db_id
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
    d.getattributes = function(attr_id) {
        var query = {
            attribute: attr_id
        }
        return $http.get('/api/database/attributes', {
                params: query
            })
            .then(function(response) {
                return reponse.data
            })
    }

    //Specific gets
    d.getMostRecentTable = function() {
        return $http.get('/api/database/recentTable').then(function(response) {
            return response.data
        })
    }
    d.getTableById = function(tableId) {
        return $http.get('/api/database/tableById/' + tableId)
            .then(function(response) {
                return response.data
            })
    }
    d.getAttributesByTableId = function(tableId) {
        return $http.get('/api/database/attributesByTableId/' + tableId)
            .then(function(response) {
                return response.data
            })
    }

    d.getTablesByName = function(tableName) {
        return $http.get('/api/database/tableName/' + tableName)
            .then(function(response) {
                return response.data
            })
    }

    d.attributesByName = function(attributeName) {
        return $http.get('/api/database/attributesByName/' + attributeName)
            .then(function(response) {
                return response.data
            })
    }
    d.getAttributesByIds = function(attributes) {
        return $http.get('/api/database/attributesByIds', attributes)
            .then(function(response) {
                return response.data
            })
    }

    //posts


    d.createTable = function(table) {
        return $http.post('/api/database/tables', table)
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

    d.createAttribute = function(attribute) {
        return $http.post('/api/database/attributes/' + attribute.table_id, attribute)
            .then(function(response) {
                return response.data
            })
    }
    d.updateAttribute = function(attribute, target) {
        console.log(attribute)
        return $http.post('/api/database/updateAttribute/' + target, attribute)
            .then(function(response) {
                return response.data
            })
    }



    return d
})