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
        return $http.get('/api/mappings/impact/tree/' + tableId)
            .then(function(response) {
                return response.data
            })
    }

    return d

})

//column is pri
//primay index upi nupi
//primary key
//foreign key