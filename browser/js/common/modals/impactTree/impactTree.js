app.controller('impactTreeCtrl', function($scope, $uibModalInstance, tree) {
    $scope.tree = tree;
    $scope.ok = function() {
        $uibModalInstance.close();
    };

})