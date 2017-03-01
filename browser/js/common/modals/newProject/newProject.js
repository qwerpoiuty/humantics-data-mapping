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
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.open = function($event) {
        $scope.status.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.status = {
        opened: false
    };


    $scope.getDayClass = function(date, mode) {
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    };
})