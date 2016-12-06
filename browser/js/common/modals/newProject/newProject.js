app.controller('newProjectCtrl', function($scope, $uibModalInstance, user, projectFactory) {
    $scope.createProject = function(project) {
        project.leader = user.id
        console.log(project)
        projectFactory.createProject(project).then(function() {
            $uibModalInstance.close()
        })
    }
})