app.controller('impactCtrl', function($scope, $uibModalInstance, impact,type) {
    $scope.type = type
    $scope.impact = impact
    switch(type){
    	case "attribute":
    		dataFactory.getImpactByAttribute($scope.impact)
    			.then(function(attributes){
    				$scope.attributes = attributes[0]
    			})
    }
})