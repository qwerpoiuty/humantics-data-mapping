app.factory("queryFactory", function($http) {
    var d = {}

    d.customQuery = function(query) {
        return $http.post('/api/query', query).then(function(response) {
            return response.data
        })
    }


})

/*
 
 */