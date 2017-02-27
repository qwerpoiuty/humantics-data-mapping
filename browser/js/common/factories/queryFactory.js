app.factory("queryFactory", function($http) {
    var d = {}

    d.customQuery = function(query) {
        var query = {
            query: query
        }
        return $http.post('/api/project/custom', query).then(function(response) {
            return response.data
        })
    }

    return d

})

/*
 
 */