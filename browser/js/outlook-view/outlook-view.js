app.config(function($stateProvider) {
    $stateProvider.state('detailed', {
        url: '/detailed/:tableId',
        templateUrl: 'js/outlook-view/outlook-view.html',
        controller: 'detailedCtrl',
        resolve: {
            table: function(dataFactory, $stateParams) {
                return dataFactory.getAttributesByTableId($stateParams.tableId).then(function(table) {
                    return table
                })
            }
        }
    })
});

app.controller('detailedCtrl', function($scope, dataFactory, table) {
    $scope.table = table[0]
    $scope.temp = {}
    $scope.selected = {}
    $scope.editing = "none"
    $scope.sourceSelection = "none"
    $scope.selectAttribute = function(attribute) {
        $scope.editing = "none"
        dataFactory.getRecentMapping(attribute.attr_id).then(function(mapping) {
            if (typeof mapping === "object") $scope.sources = mapping
            else $scope.sources = []
            $scope.targetMapping = attribute
        })
    }

    $scope.addAttribute = function(attribute) {
        $scope.selected = {}
        $scope.editing = "newAttribute"
            // dataFactory.addAttribute($scope.table, attribute)
    }

    $scope.editAttribute = function() {
        if ($scope.targetMapping) $scope.editing = "editAttribute"
        else alert('pick an attribute first')


    }

    $scope.cancel = function() {
        $scope.editing = "none"
    }
    $scope.newSource = function() {
        if ($scope.targetMapping) $scope.editing = "newSource"
        else alert('pick an attribute first')
    }

    $scope.save = function() {
        if ($scope.editing == "newSource") {
            var newSources = []
            $scope.sources.forEach(function(e) {
                newSources.push(e.attr_id)
            })
            if (!$scope.sources[0].version) var version = 1
            else var version = $scope.sources[0].version + 1
            newSources.push($scope.temp.attr.attr_id)
            var mapping = {
                version: version,
                source: newSources,
                target: $scope.targetMapping.attr_id
            }
            dataFactory.createMapping(mapping).then(function(mapping) {
                $scope.editing = "none"
                $scope.sources = $scope.sources
            })
        } else if ($scope.editing == "editAttribute") {
            console.log($scope.temp)
        }
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