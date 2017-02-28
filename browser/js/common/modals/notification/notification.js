app.controller('notification', function($scope, $uibModalInstance, message) {
    $scope.message = message
    $scope.cancel = () => {
        $uibModalInstance.close();
    };

})