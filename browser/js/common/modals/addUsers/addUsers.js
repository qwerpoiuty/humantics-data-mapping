app.controller('addMemberCtrl', function($scope, $uibModalInstance, project, projectFactory, userFactory) {
    $scope.project = project
    $scope.query = ""
    $scope.selectedMembers = {}
    $scope.getUsers = () => {
        userFactory.getUsers().then(users => {
            $scope.members = users
            console.log($scope.members)
        })
    }
    $scope.getUsers()
    $scope.addToProject = () => {
        $scope.arr = []
        for (const key of Object.keys($scope.members)) {
            if ($scope.members[key].selected == true) $scope.arr.push(Number(key))
        }

        $scope.arr.forEach(e => {
            if ($scope.project.tables.indexOf(Number(e)) !== -1) {
                $scope.arr.splice($scope.arr.indexOf(Number(e)), 1)
            }
        })
        projectFactory.updateProject($scope.project.project_id, "members", $scope.arr).then(results => {
            $uibModalInstance.close($scope.project.project_id)
        })
    }
    $scope.cancel = () => {
        $uibModalInstance.close();
    };

})