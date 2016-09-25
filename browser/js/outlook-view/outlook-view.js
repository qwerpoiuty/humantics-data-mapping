app.config(function($stateProvider) {
    $stateProvider.state('detailed', {
        url: '/detailed/:tableId',
        templateUrl: 'js/outlook-view/outlook-view.html',
        controller: 'detailedCtrl',
        resolve:{
            table: function(dataFactory, $stateParams){
                return dataFactory.getTableById($stateParams.tableId).then(function(table){
                    return table
                })
            }
        }
    })
});

app.controller('detailedCtrl', function($scope, dataFactory,table) {
    $scope.table = table[0]
    $scope.temp = {}
    $scope.selected = {}
    $scope.editing = "none"
    $scope.sourceSelection ="none"
    $scope.selectAttribute = function(attribute) {
        $scope.editing = "none"
        dataFactory.getMapping(attribute.attr_id).then(function(mapping){
            $scope.sourceMapping = mapping[0][0]
            $scope.targetMapping = attribute
        })
    }

    $scope.addAttribute = function(attribute) {
        $scope.selected = {}
        $scope.editing = "newAttribute"
        console.log($scope.editing)
        // dataFactory.addAttribute($scope.table, attribute)
    }
    $scope.editAttribute = function() {
        //toggles the edit state. 
        console.log($scope.editing)
        if ($scope.editing=="none") $scope.editing = 'editAttribute'
        else $scope.editing = "none"
    }

    $scope.save = function(){
        $scope.editing = "none"
        var mapping = {
            name:'Test',
            source: $scope.temp.attr.attr_id,
            target: $scope.temp.target.attr_id,
            date_modified: Date.now(),
        }
        dataFactory.createMapping(mapping).then(function(mapping){
            $scope.$digest()
        })
    }

    $scope.newRule = false
    $scope.addTransformation = function() {
        $scope.newRule = !$scope.newRule
    }
    $scope.rules = [{
        name: 'Rule 1',
        body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }, {
        name: 'Rule 2',
        body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }, {
        name: 'Rule 3',
        body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }]

    
});