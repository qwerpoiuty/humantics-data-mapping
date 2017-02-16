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
    d.searchTables = function(search) {
        return $http.get('/api/database/searchtables', search)
            .then(function(response) {
                return response.data
            })
    }

    //posts
    //creates
    d.createSystem = system => {
        return $http.post('/api/database/system', system).then(response => {
            return response.data
        })
    }
    d.createDatabase = db => {
        return $http.post('/api/database/db', db).then(response => {
            return response.data
        })
    }
    d.createSchema = schema => {
        console.log(schema)
        return $http.post('/api/database/schema', schema).then(response => {
            return response.data
        })
    }
    d.createTable = function(table) {
        return $http.post('/api/database/tables', table)
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

    //updates
    d.updateSystem = system => {
        return $http.post('api/database/updateSystem/', system).then(response => {
            return response.data
        })
    }
    d.updateDatabase = db => {
        return $http.post('api/database/updateDatabase/', db).then(response => {
            return response.data
        })
    }
    d.updateSchema = schema => {
        return $http.post('api/database/updateSchema/', schema).then(response => {
            return response.data
        })
    }
    d.updateTable = table => {
        return $http.post('api/database/updateTable/', table).then(response => {
            return response.data
        })
    }

    d.updateTableComments = (table_id, comments) => {
        return $http.post('api/database/updateTableComments/' + table_id, comments).then(response => {
            return response.data
        })
    }

    d.updateTableStatus = table => {
        return $http.post('api/database/updateTableStatus/', table).then(response => {
            return response.data
        })
    }
    d.lockTable = (tableId, status) => {
        var table = {
            table_id: tableId,
            status: status
        }
        return $http.post('api/database/lockTable', table).then(response => {
            return response.data
        })
    }
    d.updateAttribute = function(attribute, target) {
        return $http.post('/api/database/updateAttribute/' + target, attribute)
            .then(function(response) {
                return response.data
            })
    }

    //deletes
    d.deleteSystem = id => {
        return $http.post('api/database/deleteSystem/' + id).then(response => {
            return response.data
        })
    }

    d.deleteDatabase = id => {
        return $http.post('api/database/deleteDatabase/' + id).then(response => {
            return response.data
        })
    }

    d.deleteSchema = id => {
        return $http.post('api/database/deleteSchema/' + id).then(response => {
            return response.data
        })
    }

    d.deleteTable = id => {
        return $http.post('api/database/deleteTable/' + id).then(response => {
            return response.data
        })
    }



    return d
})