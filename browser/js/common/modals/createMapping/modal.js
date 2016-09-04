app.controller('createMapCtrl', function($scope, $uibModalInstance, dataFactory, attribute, dbs) {
    $scope.source = {}
    $scope.source.dbs = dbs
    $scope.attributeTarget = true
    $scope.target = attribute
    $scope.attribute = attribute
    $scope.switch = function() {
        var temp = $scope.target
        $scope.attributeTarget = !$scope.attributeTarget
        $scope.target = $scope.source;
        $scope.source = temp;

    }
    $scope.setDb = function(db) {
        if ($scope.attributeTarget) {

            $scope.source.db = db;
        } else {
            $scope.target.db = db
        }
    }
    $scope.setSchema = function(schema) {
        console.log('hi')
        if ($scope.attributeTarget) {
            $scope.source.schema = schema
        } else {
            $scope.target.schema = schema
        }
    }
    $scope.$watch(function() {
        return $scope.source.db
    }, function(ov, nv) {
        if (ov !== nv) {
            $scope.source.schemas = dataFactory.getSchemas(nv)
        }
    })
    $scope.$watch(function() {
        return $scope.source.schema
    }, function(ov, nv) {
        if (ov !== nv) {
            $scope.source.table = dataFactory.getTables(nv).map(function(e) {
                return e.entity
            })
        }
    })



})