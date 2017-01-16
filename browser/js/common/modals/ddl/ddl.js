app.controller('ddlInstanceCtrl', function($scope, $uibModalInstance, ddl) {
    $scope.ddl = ddl;
    console.log(ddl)
    $scope.ok = function() {
        $uibModalInstance.close();
    };

})