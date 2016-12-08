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
        }
    });
});

app.controller('manageCtrl', function($scope, AuthService, projectFactory, dataFactory, user, projects, $modal, $state) {

    $scope.user = user
    $scope.projects = projects[0]
    $scope.currentPro = "Select a Project"
    $scope.selectedTask = "false"


    $scope.selectProject = function(project) {
        $scope.currentPro = project.project_name
        $scope.selectedTask = "true"
        projectFactory.getProjectById(project.project_id).then(function(project) {
            $scope.targetProject = project[0]
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
    }

    $scope.detailedView = function(table_id) {
            $state.go('detailed', {
                tableId: table_id
            })
        }
});