app.controller('newProjectCtrl', function($scope, $uibModalInstance, user, projectFactory) {
    $scope.createProject = function(project) {
        project.leader = user.id
        project.members = [user.id]
        project.due_date = $scope.dt
        projectFactory.createProject(project).then(function() {
            $uibModalInstance.close(200)
        })
    }
    $scope.cancel = () => {
        $uibModalInstance.close()
    }
    $(function() {
        $(".datepicker, .datepickeredit").datepicker({
            dateFormat: 'yy/mm/dd'
        });
    });

})