app.factory("queryFactory", function($http) {
    var d = {}

    d.customQuery = function(query) {
        console.log(query)
        return $http.get('/api/projects/custom', query).then(function(response) {
            return response.data
        })
    }


})

/*
 
 */