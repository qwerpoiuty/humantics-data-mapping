app.factory('projectFactory', function($http) {
    var d = {}

    //high level gets
    d.getProjects = function(userId) {
        return $http.get('api/project/projectbyUser/' + userId)
            .then(function(response) {
                var projects = response.data[0]
                var mappedProject = {}
                for (var i = 0; i < projects.length; i++) {
                    if (mappedProject[projects[i].project_id]) {
                        mappedProject[projects[i].project_id].tables.push({
                            table_id: projects[i].table_id,
                            table_status: projects[i].table_status
                        })
                    } else {
                        var el = projects[i]
                        mappedProject[projects[i].project_id] = {
                            project_id: el.project_id,
                            project_name: el.project_name,
                            due_date: el.due_date,
                            leader: el.project_leader,
                            members: el.members,
                            tables: [{
                                table_id: projects[i].table_id,
                                table_status: projects[i].table_status
                            }]
                        }
                    }
                }
                return mappedProject
            })
    }
    d.getAllProjects = () => {
        return $http.get('/api/project/')
            .then(function(response) {
                var projects = response.data[0]
                var mappedProject = {}
                for (var i = 0; i < projects.length; i++) {
                    if (mappedProject[projects[i].project_id]) {
                        mappedProject[projects[i].project_id].tables.push({
                            table_id: projects[i].table_id,
                            table_status: projects[i].table_status
                        })
                    } else {
                        var el = projects[i]
                        mappedProject[projects[i].project_id] = {
                            project_id: el.project_id,
                            project_name: el.project_name,
                            due_date: el.due_date,
                            leader: el.project_leader,
                            members: el.members,
                            tables: [{
                                table_id: projects[i].table_id,
                                table_status: projects[i].table_status
                            }]
                        }
                    }
                }
                return mappedProject
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
                console.log(response.data)
                return response.data
            })
    }

    d.createProject = function(project) {
        return $http.post('api/project', project)
            .then(function(response) {
                return response.data
            })
    }
    d.updateProject = function(projectId, columns, values) {
        var project = {
            id: projectId,
            column: columns,
            values: values
        }
        return $http.post('api/project/updateProject', project)
            .then(function(response) {
                return response.data
            })
    }
    d.editProject = function(projectId, columns, values) {
        var project = {
            id: projectId,
            columns: columns,
            values: values
        }
        return $http.post('api/project/editProject', project).then(response => {
            return response.data
        })
    }
    d.deleteProject = project_id => {
        return $http.post('api/project/deleteProject/' + project_id).then(response => {
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