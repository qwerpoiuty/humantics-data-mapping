app.factory('projectFactory', function($http) {
    var d = {}

    //high level gets
    d.getProjects = function() {
        return $http.get('api/project')
            .then(function(response) {
                return response.data
            })
    }

    d.getProjectById = function(projectId) {
        return $http.get('api/project/' + projectId)
            .then(function(response) {
                return response.data
            })
    }

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
    d.addTablesThroughQuery = function(query, projectId) {
        var query = {
            query: query,
            project: projectId
        }
        return $http.post('/api/project/addTablesThroughQuery', query).then(function(response) {
            return response.data
        })
    }
    return d
})