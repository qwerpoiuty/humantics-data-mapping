app.controller('confirmation', function($scope, $uibModalInstance, message) {
    $scope.message = message
    $scope.confirm = () => {
        $uibModalInstance.close(true);
    }
    $scope.cancel = () => {
        $uibModalInstance.close(false);
    };

})