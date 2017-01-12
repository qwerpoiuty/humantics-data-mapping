app.config(function($stateProvider) {
    $stateProvider.state('management', {
        url: '/management',
        templateUrl: 'js/management/management.html',
        controller: 'manageCtrl',
        resolve: {
            projects: function(projectFactory) {
                return projectFactory.getProjects().then(function(projects) {
                    return projects
                })
            },
            user: function(AuthService) {
                return AuthService.getLoggedInUser().then(function(user) {
                    return user
                })
            }
        },
        data: {
            authenticate: true
        }
    });
});

app.controller('manageCtrl', function($scope, AuthService, projectFactory, dataFactory, mappingFactory, user, projects, $modal, $state) {
    $scope.user = user
    $scope.projects = projects[0]
    $scope.currentPro = "Select a Project"
    $scope.selectedProject = false
    $scope.changingStatus = false
    $scope.toggleChange = function() {
        $scope.changingStatus = !$scope.changingStatus
    }
    $scope.completeProject = (project) => {
        var query = {
            column: 'status',
            value: 'complete'
        }
        projectFactory.updateProject(project.project_id, query).then(() => {
            $scope.refreshProjects()
        })
    }
    $scope.selectProject = function(project) {
        $scope.currentPro = project.project_name
        $scope.selectedProject = project
        $scope.refreshSingleProject(project.project_id)
    }

    $scope.addTables = () => {
        var modalInstance = $modal.open({
            templateUrl: "js/common/modals/addTables/addTables.html",
            controller: `addTableCtrl`,
            size: 'lg',
            resolve: {
                project: () => {
                    return $scope.selectedProject
                }
            }
        })
        modalInstance.result.then((result) => {
            if (result) {
                $scope.refreshSingleProject(result)
            }
        })
    }

    $scope.newProject = function() {
        var modalInstance = $modal.open({
            templateUrl: 'js/common/modals/newProject/newProject.html',
            controller: 'newProjectCtrl',
            size: 'lg',
            resolve: {
                user: function() {
                    return $scope.user
                }
            }
        });
        modalInstance.result.then((results) => {
            $scope.refreshProjects()
        })
    }

    $scope.detailedView = function(table_id) {
        $state.go('detailed', {
            tableId: table_id
        })
    }


    $scope.toggleChange = function() {
        $scope.changingStatus = !$scope.changingStatus
    }
    $scope.changeStatus = function(status) {
        var temp = {
            status: mappingStatus,
            id: $scope.targetMapping.attr_id,
            version: $scope.sources[0].version
        }
        mappingFactory.changeStatus(temp)
    }



    //REFRESH FUNCTIONS
    $scope.refreshProjects = () => {
        projectFactory.getProjects().then(projects => {
            $scope.projects = projects[0]
        })
    }
    $scope.refreshSingleProject = (id) => {
        projectFactory.getProjectById(id).then(function(project) {
            $scope.targetProject = project[0]
        })
    }


});