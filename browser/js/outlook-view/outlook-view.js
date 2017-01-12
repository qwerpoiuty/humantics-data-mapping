app.config(function($stateProvider) {
    $stateProvider.state('detailed', {
        url: '/detailed/:tableId',
        templateUrl: 'js/outlook-view/outlook-view.html',
        controller: 'detailedCtrl',
        resolve: {
            attributes: function(dataFactory, $stateParams) {
                return dataFactory.getAttributesByTableId($stateParams.tableId).then(function(attributes) {
                    return attributes
                })
            },
            table: function(dataFactory, $stateParams) {
                return dataFactory.getTableById($stateParams.tableId).then(function(table) {
                    return table
                })
            },
            user: function(AuthService) {
                return AuthService.getLoggedInUser().then(function(user) {
                    return user
                })
            }
        },
        data: {
            authenticate: true
        }
    })
});

app.controller('detailedCtrl', function($scope, dataFactory, table, attributes, user, mappingFactory, $stateParams, $uibModal) {
    $scope.table = table[0][0]
    $scope.user = user
    $scope.attributes = attributes[0]
    $scope.temp = {}
    $scope.selected = {}
    $scope.editing = "none"
    $scope.sourceSelection = "none"
    $scope.sourceIndex = 0
    $scope.currentAttr = "Select an Attribute"


    $scope.selectAttribute = function(attribute) {
        $scope.editing = "none"
        $scope.changingStatus = false
        mappingFactory.getRecentMapping(attribute.attr_id).then(function(mapping) {
            if (typeof mapping === "object") $scope.sources = mapping
            else $scope.sources = []
            $scope.targetMapping = attribute
            $scope.rules = $scope.sources[0] ? $scope.sources[0].transformation_rules : []
            if ($scope.sources[0]) $scope.targetmapping = $scope.sources[0].version
            else $scope.targetMapping.version = 1
            if ($scope.rules == null) $scope.rules = []
            $scope.currentAttr = $scope.targetMapping.attr_name
        })
    }

    $scope.addAttribute = function(attribute) {
        $scope.temp = $scope.table
        $scope.editing = "newAttribute"
        $scope.currentAttr = "New Attribute"
            // dataFactory.addAttribute($scope.table, attribute)
    }

    $scope.editAttribute = function() {
        if ($scope.user.power_level < 2) {
            alert('You don\'t have permissions to do that')
            return
        }
        if ($scope.targetMapping) {
            $scope.editing = "editAttribute"
            $scope.temp.target = Object.assign({}, $scope.targetMapping)
            $scope.temp.target.properties.forEach(e => {
                $scope.temp.target.properties[e] = true
            })
        } else alert('pick an attribute first')


    }

    $scope.cancel = () => {
        $scope.editing = "none"
    }
    $scope.newSource = function() {
        if ($scope.user.power_level < 2) {
            alert('You don\'t have permissions to do that')
            return
        }
        if ($scope.targetMapping) $scope.editing = "newSource"
        else alert('pick an attribute first')
    }

    $scope.deleteSource = function() {
        var mapping = $scope.setMapping()
        mapping.source.splice($scope.temp.sourceIndex, 1)
        mappingFactory.updateMapping(mapping).then(function(mapping) {
            dataFactory.getAttributesByTableId($stateParams.tableId).then((attributes) => {
                $scope.attributes = attributes[0]
                $scope.currentAttr = $scope.targetMapping.attr_name
                $scope.sources = []
                $scope.targetMapping = {}
            })
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
                    $scope.selectAttribute($scope.targetMapping)
                })
                break
            case "editAttribute":
                var mapping = $scope.setMapping()
                if ($scope.temp.hasOwnProperty('source')) mapping.source[$scope.sourceIndex] = $scope.temp.source.attr.attr_id
                if ($scope.temp.target) {
                    var arr = ['pk', 'fk', 'upi', 'npi']
                    var properties = []
                    arr.forEach(e => {
                        if ($scope.temp.target.properties[e]) properties.push(e)
                    })
                    $scope.temp.target.properties = properties
                    dataFactory.updateAttribute($scope.temp.target, $scope.targetMapping.attr_id)
                        .then(function(target) {
                            mappingFactory.updateMapping(mapping)
                                .then(function() {
                                    $scope.editing = "none"
                                    dataFactory.getAttributesByTableId($stateParams.tableId).then((attributes) => {
                                        $scope.attributes = attributes[0]
                                        $scope.attributes.forEach(e => {
                                            if (e.attr_id == mapping.target) {
                                                $scope.selectAttribute(e)
                                                return
                                            }
                                        })
                                    })
                                })
                        })
                }
                break
            case "newAttribute":
                $scope.temp.target.table_id = $stateParams.tableI
                var arr = []
                for (var key in $scope.temp.target.properties) {
                    if ($scope.temp.target.properties[key]) arr.push(key)
                }
                $scope.temp.target.properties = arr
                dataFactory.createAttribute($scope.temp.target).then(function(table) {
                    dataFactory.getAttributesByTableId($stateParams.tableId).then(function(attributes) {
                        $scope.attributes = attributes[0]
                    })
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
        mapping.transformation_rules = ($scope.rules.length) ? $scope.rules : null
        return mapping
    }
    $scope.toggleChange = function() {
        $scope.changingStatus = !$scope.changingStatus
    }
    $scope.changeStatus = function(status) {
        var temp = {
            status: status,
            id: $scope.targetMapping.attr_id,
            version: $scope.sources[0].version
        }
        mappingFactory.changeStatus(temp)
    }

    $scope.generateDDL = function() {
        //allow for inidividuals to modify conditions on the attributes such as not null and default values
        var ddl = "CREATE TABLE " + $scope.table.table_name + "\n(\n"
        var body = []
        for (var i = 0; i < $scope.attributes.length; i++) {
            body.push($scope.attributes[i].attr_name + " " + $scope.attributes[i].datatype) + "\n"
        }
        ddl += body.join(',\n')
        ddl += "\n)"
        let primaryIndex = ""
        let upi = []
        let npi = []
        for (var k of attributes[0]) {
            if (k.properties !== null) {
                if (k.properties.indexOf('upi') >= 0) {
                    upi.push(k.attr_name)
                }
                if (k.properties.indexOf('npi') >= 0) {
                    npi.push(k.attr_name)
                }
            }
        }
        if (upi.length > 0) ddl += `\nUNIQUE PRIMARY INDEX(${upi.join(',')})`
        if (npi.length > 0) ddl += `\nPRIMARY INDEX(${npi.join(',')})`

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'js/common/modals/ddl/ddl.html',
            controller: 'ddlInstanceCtrl',
            backdrop: 'static',
            keyboard: false,
            size: "small",
            resolve: {
                ddl: function() {
                    return ddl;
                }
            }
        });

    }
});