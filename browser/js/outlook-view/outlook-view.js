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

app.controller('detailedCtrl', function($scope, dataFactory, table, user, mappingFactory, $stateParams) {
    if (table) $scope.table = table[0]
    else {
        dataFactory.getTableById($stateParams.tableId).then(function(table) {
            $scope.table = table
        })
    }
    $scope.user = user
    $scope.temp = {}
    $scope.selected = {}
    $scope.editing = "none"
    $scope.sourceSelection = "none"
    $scope.sourceIndex = 0
    $scope.selectAttribute = function(attribute) {
        $scope.editing = "none"
        mappingFactory.getRecentMapping(attribute.attr_id).then(function(mapping) {
            if (typeof mapping === "object") $scope.sources = mapping
            else $scope.sources = []
            $scope.targetMapping = attribute
            $scope.rules = $scope.sources[0] ? $scope.sources[0].transformation_rules : []
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

    $scope.deleteSource = function() {
        var mapping = $scope.setMapping()
        mapping.source.splice($scope.temp.sourceIndex, 1)
        mappingFactory.updateMapping(mapping).then(function(mapping) {
            $scope.apply()
        })

    }

    $scope.save = function() {
        switch ($scope.editing) {
            case "newSource":
                var mapping = $scope.setMapping()
                mapping.source.push($scope.temp.attr.attr_id)
                mappingFactory.updateMapping(mapping).then(function(mapping) {
                    $scope.editing = "none"
                    $scope.sources = $scope.sources
                })
                break
            case "editAttribute":
                var mapping = $scope.setMapping()
                mapping.source[$scope.sourceIndex] = $scope.temp.attr_id
                if ($scope.temp.target) {
                    mappingFactory.updateAttribute($scope.temp.target, $scope.targetMapping.attr_id)
                        .then(function(target) {
                            mappingFactory.updateMapping(mapping)
                                .then(function(mapping) {
                                    $scope.selectAttribute($scope.targetMapping)
                                })
                        })
                }
                break
            case "newAttribute":
                $scope.temp.target.table_id = $stateParams.tableId
                dataFactory.createAttribute($scope.temp.target).then(function(table) {
                    console.log('hello')
                })
        }
    }

    $scope.setMapping = function() {
        var newSources = []
        $scope.sources.forEach(function(e) {
            newSources.push(e.attr_id)
        })
        if (!$scope.sources[0]) var version = 1
        else var version = $scope.sources[0].version + 1
        var mapping = {
            version: version,
            modifier: $scope.user.id,
            source: newSources,
            target: $scope.targetMapping.attr_id
        }
        mapping.transformation_rules = ($scope.rules.length) ? $scope.rules : "NULL"
        return mapping
    }

    $scope.changeStatus = function(status) {
        var temp = {
            status: status,
            id: $scope.targetMapping.attr_id,
            version: $scope.sources[0].version
        }
        mappingFactory.changeStatus(temp)
    }


});