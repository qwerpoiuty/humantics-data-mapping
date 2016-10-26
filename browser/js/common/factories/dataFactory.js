app.factory('dataFactory', function($http) {
    var d = {}

    //high level gets
    d.getProjects = function() {
        return $http.get('api/projects')
            .then(function(response) {
                return response.data
            })
    }

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
            db: dbID
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
    d.createProject = function(project) {
        return $http.post('api/project', project)
            .then(function(response) {
                return response.data
            })
    }
    d.updateProject = function(project) {
        return $http.put('api/project', project)
            .then(function(response) {
                return response.data
            })
    }

    d.createTable = function(table) {
        var query = table
        return $http.post('/api/tables', {
                params: query
            })
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
        return $http.post('/api/database/updateAttribute/' + target, attribute)
            .then(function(response) {
                return response.data
            })
    }



    return d
})