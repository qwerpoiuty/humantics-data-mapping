app.factory('mappingFactory', function($http) {
    var d = {}
        //gets
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

    d.updateRules = function(transformationRules, targetId) {
        return $http.post('/api/mappings/rules/' + targetId, transformationRules).then(function(response) {
            return response.data
        })
    }
    d.changeStatus = function(status) {
        console.log(status)
        return $http.post('/api/mappings/changeStatus/', status).then(function(response) {
            return response.data
        })
    }

    return d
})