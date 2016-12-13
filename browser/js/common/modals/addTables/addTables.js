app.controller('addTableCtrl', function($scope, $uibModalInstance, project, projectFactory, queryFactory) {
    $scope.project = project
    $scope.query = ""
    $scope.tables = {}
    $scope.addTables = (query) => {
        queryFactory.customQuery(query).then(results => {
            $scope.tableResults = results[0]
        })
    }

    $scope.addToProject = () => {
        $scope.arr = []
        for (const key of Object.keys($scope.tables)) {
            if ($scope.tables[key].selected == true) $scope.arr.push(key)
        }
        projectFactory.updateProject($scope.project.project_id, "tables", $scope.arr).then(results => {
            $uibModalInstance.close($scope.project.project_id)
        })
    }
    $scope.cancel = () => {
        $uibModalInstance.close();
    };

})