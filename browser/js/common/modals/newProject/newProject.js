app.controller('newProjectCtrl', function($scope, $uibModalInstance, user, projectFactory) {
    $scope.createProject = function(project) {
        project.leader = user.id
        project.members = [user.id]
        projectFactory.createProject(project).then(function() {
            $uibModalInstance.close(200)
        })
    }
    $(".form_datetime").datetimepicker({
        format: 'yyyy-mm-dd hh:ii'
    });
})