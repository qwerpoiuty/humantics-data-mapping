app.factory('projectFactory', function($http) {
    var d = {}

    //high level gets
    d.getProjects = function() {
        return $http.get('api/project')
            .then(function(response) {
                return response.data
            })
    }
    d.getAssignedMappings = user => {
        var query = {
            user_id: user.id
        }
        switch (user.power_level) {
            case 1:
                query.stage = 'incomplete'
                break
            case 2:
                query.stage = 'pending review'
                break
            case 3:
                query.stage = 'pending approval'
                break
            default:
                $http.get('api/project').then(response => {
                    return response.data
                })
        }
        return $http.get('api/project/assignedMappings', {
            params: query
        }).then(response => {
            return response.data
        })

    }
    d.getCompletedMappings = () => {
        return $http.get('api/project/completedMappings').then(mappigns => {
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
    d.updateProject = function(projectId, column, values) {
        var project = {
            id: projectId,
            column: column,
            values: values
        }
        return $http.post('api/project/updateProject', project)
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