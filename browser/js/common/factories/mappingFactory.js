app.factory('mappingFactory', function($http) {
    var d = {}

    d.getMapping = function(target) {
        var query = {
            attr_id: target
        }
        return $http.get('/api/mappings', {
                params: query
            })
            .then(function(response) {
                return response.data
            })
    }
    d.getRecentMapping = function(target) {
        var query = {
            attr_id: target
        }
        return $http.get('/api/mappings/recentMapping', {
            params: query
        }).then(function(response) {
            return response.data
        })
    }

    //posts
    d.createMapping = function(mapping) {
        return $http.post('/api/mappings', mapping)
            .then(function(response) {
                return response.data
            })
    }

    d.updateMapping = function(mapping) {
        return $http.post('/api/mappings', mapping).then(function(response) {
            return response.data

        })
    }
    d.updateNotes = function(notes, target, version) {
        let payload = {
            notes: notes,
            version: version
        }
        return $http.post('/api/mappings/updateNotes/' + target, payload).then(response => {
            return response.data
        })
    }


    return d
})