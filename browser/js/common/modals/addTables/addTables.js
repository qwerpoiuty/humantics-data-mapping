app.controller('addTableCtrl', function($scope, $uibModalInstance, project, projectFactory, queryFactory) {
    $scope.project = project
    $scope.query = ""
    $scope.tables = {}
    console.log($scope.project)
    $scope.addTables = (query) => {
        queryFactory.customQuery(query).then(results => {
            $scope.tableResults = results[0]
        })
    }

    $scope.addToProject = () => {
        $scope.arr = []
        for (const key of Object.keys($scope.tables)) {
            if ($scope.tables[key].selected == true) $scope.arr.push(Number(key))
        }

        $scope.arr.forEach(e => {
            if ($scope.project.tables.indexOf(Number(e)) !== -1) {
                $scope.arr.splice($scope.arr.indexOf(Number(e)), 1)
            }
        })
        projectFactory.updateProject($scope.project.project_id, "tables", $scope.arr).then(results => {
            $uibModalInstance.close($scope.project.project_id)
        })
    }
    $scope.cancel = () => {
        $uibModalInstance.close();
    };

})