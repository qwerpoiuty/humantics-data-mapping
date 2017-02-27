app.controller('addMemberCtrl', function($scope, $uibModalInstance, project, projectFactory, userFactory) {
    $scope.project = project
    $scope.selectedMembers = {}
    $scope.power_levels = {
        0: 'Reader',
        1: 'Mapper',
        2: 'Reviewer',
        3: 'Approver',
        4: 'Manager',
        5: 'Admin'
    }
    $scope.project.members.forEach(user => {
        $scope.selectedMembers[user] = {
            selected: true
        }
    })
    $scope.getUsers = () => {
        userFactory.getUsers().then(users => {
            $scope.members = users[0]
        })
    }
    $scope.getUsers()
    $scope.addToProject = () => {
        $scope.arr = []
        for (const key of Object.keys($scope.selectedMembers)) {
            if ($scope.selectedMembers[key].selected) $scope.arr.push(Number(key))
        }

        projectFactory.updateProject($scope.project.project_id, "members", $scope.arr).then(results => {
            $uibModalInstance.close($scope.arr)
        })
    }
    $scope.cancel = () => {
        $uibModalInstance.close();
    };

});