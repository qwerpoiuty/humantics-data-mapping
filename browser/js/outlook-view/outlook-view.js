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
            },
            user: function(AuthService) {
                return AuthService.getLoggedInUser().then(function(user) {
                    return user
                })
            }
        }
    })
});

app.controller('detailedCtrl', function($scope, dataFactory, table, user) {
    $scope.table = table[0]
    $scope.user = user
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
            $scope.rules = ($scope.targetMapping.transformation_rules) ? $scope.targetMapping.transformation_rules : []
            console.log($scope.rules)
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
        var newSources = []
        $scope.sources.forEach(function(e) {
            newSources.push(e.attr_id)
        })
        if (!$scope.sources[0].version) var version = 1
        else var version = $scope.sources[0].version + 1

        var mapping = {
            version: version,
            modifier: $scope.user.id,
            source: newSources,
            target: $scope.targetMapping.attr_id
        }

        if ($scope.editing == "newSource") {
            mapping.source.push($scope.temp.attr.attr_id)

            dataFactory.updateMapping(mapping).then(function(mapping) {
                $scope.editing = "none"
                $scope.sources = $scope.sources
            })
        } else if ($scope.editing == "editAttribute") {
            mapping.source[$scope.sourceIndex] = $scope.temp.attr_id
            if ($scope.temp.target) {
                dataFactory.updateAttribute($scope.temp.target, $scope.targetMapping.attr_id)
                    .then(function(target) {
                        dataFactory.updateMapping(mapping)
                            .then(function(mapping) {
                                $scope.selectAttribute($scope.targetMapping)
                            })
                    })

            }

        }
    }

    $scope.newRule = false
    $scope.addTransformation = function() {
        $scope.newRule = !$scope.newRule
    }



});