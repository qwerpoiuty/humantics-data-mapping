app.controller('addTableCtrl', function($scope, $uibModalInstance, project, projectFactory) {
    $scope.project = project
    $scope.query = ""
    $scope.addTables = (query) => {
        projectFactory.addTablesThroughQuery(query, project.project_id).then((response) => {
            if (response = 200) $uibModalInstance.close(project.project_id)
            else alert("Statement Error")
        })
    }
    $scope.cancel = () => {
        $uibModalInstance.close();
    };

})