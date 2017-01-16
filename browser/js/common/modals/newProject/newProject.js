app.controller('newProjectCtrl', function($scope, $uibModalInstance, user, projectFactory) {
    $scope.createProject = function(project) {
        project.leader = user.id
        projectFactory.createProject(project).then(function() {
            $uibModalInstance.close(200)
        })
    }
})