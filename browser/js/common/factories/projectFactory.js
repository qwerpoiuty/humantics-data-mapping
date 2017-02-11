app.factory('projectFactory', function($http) {
    var d = {}

    //high level gets
    d.getProjects = function(userId) {
        return $http.get('api/project/projectbyUser/' + userId)
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
                query.stage = 'Incomplete'
                break
            case 2:
                query.stage = 'Pending Review'
                break
            case 3:
                query.stage = 'Pending Approval'
                break
            case 4:
                query.stage = 'Approved'
            case 5:
                query.stage = 'Incomplete'
        }
        return $http.get('api/project/assignedMappings', {
            params: query
        }).then(response => {
            return response.data
        })

    }
    d.getPermission = (user_id, table_id) => {
        var query = {
            table_id: table_id
        }
        return $http.get('api/project/getPermission/' + user_id, {
            params: query
        }).then(response => {
            return response.data
        })
    }
    d.getCompletedMappings = () => {
        return $http.get('api/project/completedMappings').then(response => {
            return response.data
        })
    }
    d.getProjectById = function(projectId) {
        return $http.get('api/project/single/' + projectId)
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
    d.deletProject = project_id => {
        return $http.post('apl/project/' + project_id).then(response => {
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