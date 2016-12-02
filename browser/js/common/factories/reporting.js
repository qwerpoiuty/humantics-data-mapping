app.factory('reportingFactory', function($http) {
    var d = {}

    //impact analysis
    d.getImpactByTable = function(tableId) {
        return $http.get('/api/mappings/impact/table/' + tableId)
            .then(function(response) {
                return response.data
            })
    }

    d.getImpactByAttribute = function(attr_id) {
        return $http.get('/api/mappings/impact/attribute/' + attr_id)
            .then(function(response) {
                return response.data
            })
    }

    d.getTree = function(tableId) {
        return $http.get('/api/mappings/impact/tree/' + 2)
            .then(function(response) {
                return response.data
            })
    }

    return d

})