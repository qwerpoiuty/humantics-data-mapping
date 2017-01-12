app.config(function($stateProvider) {
    $stateProvider.state('reporting', {
        url: '/reporting',
        templateUrl: 'js/reporting/reporting.html',
        controller: 'reportCtrl'

    })
});

app.controller('reportCtrl', function($scope, dataFactory, AuthService, reportingFactory, $uibModal) {
    dataFactory.getSystems().then(function(systems) {
        $scope.systems = systems[0]
    })

    $scope.impactSearches = []
    $scope.selectedSystem = {}
    $scope.selectedDb = {}
    $scope.selectedSchema = {}
    $scope.selectedTable = {}

    $scope.$watch(function() {
        return $scope.selectedSystem.value
    }, function(nv, ov) {
        if (nv !== ov) {
            dataFactory.getDatabases(nv.system_id).then(function(dbs) {
                $scope.dbs = dbs[0]
            })
        }
    })

    $scope.$watch(function() {
        return $scope.selectedDb.value
    }, function(nv, ov) {
        if (nv !== ov) {
            if ($scope.selectedSchema.hasOwnProperty('value')) $scope.selectedSchema = {}
            dataFactory.getSchemas(nv.db_id).then(function(schemas) {
                $scope.schemas = schemas[0]
            })
        }
    })
    $scope.$watch(function() {
        return $scope.selectedSchema.value
    }, function(nv, ov) {
        if (nv !== ov) {

            dataFactory.getTables(nv.schema_id).then(function(tables) {
                $scope.tables = tables[0]
            })
        }
    })

    $scope.$watch(function() {
            return $scope.selectedTable.value
        }, function(nv, ov) {
            if (nv !== ov) {
                reportingFactory.getImpactByTable(nv.table_id).then(function(attributes) {
                    $scope.attributes = attributes[0]
                })
            }
        })
        //search stuff
    $scope.searchQuery = ""
    $scope.attributeSearch = function(query) {
        dataFactory.attributesByName(query).then(function(attributes) {
            $scope.sources = attributes[0]
            $scope.impactSearches.push($scope.sources)
        })
    }


    $scope.impact = function(attr_id) {
        reportingFactory.getImpactByAttribute(attr_id)
            .then(function(attributes) {
                $scope.targets = attributes[0]
            })
    }

    $scope.nextImpact = function(attr_id) {
        $scope.impactSearches.push($scope.sources)
        $scope.sources = null
        $scope.sources = $scope.targets
        $scope.targets = null
        reportingFactory.getImpactByAttribute(attr_id).then(function(attributes) {
            $scope.targets = attributes[0]
        })
    }

    $scope.previousImpact = function() {
        $scope.impactSearches.pop()
        $scope.sources = $scope.impactSearches[$scope.impactSearches.length - 1]
        $scope.targets = []
    }

    $scope.tableImpact = function(table) {
        reportingFactory.getTree(table.table_id).then(tree => {
            $scope.tree = unflatten(tree)

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'js/common/modals/impactTree/impactTree.html',
                controller: 'impactTreeCtrl',
                backdrop: 'static',
                keyboard: false,
                size: "xl",
                resolve: {
                    tree: function() {
                        return tree;
                    }
                }
            });
        })
        let unflatten = arr => {
            var tree = [],
                mappedArr = {},
                arrElem,
                mappedElem;

            // First map the nodes of the array to an object -> create a hash table.
            for (var i = 0, len = arr.length; i < len; i++) {
                arrElem = arr[i];
                mappedArr[arrElem.id] = arrElem;
                mappedArr[arrElem.id]['children'] = [];
            }


            for (var id in mappedArr) {
                if (mappedArr.hasOwnProperty(id)) {
                    mappedElem = mappedArr[id];
                    // If the element is not at the root level, add it to its parent array of children.
                    if (mappedElem.parent) {
                        mappedArr[mappedElem['parent']]['children'].push(mappedElem);
                    }
                    // If the element is at the root level, add it to first level elements array.
                    else {
                        tree.push(mappedElem);
                    }
                }
            }
            return tree;
        }

    }

    $scope.totalMappings = table => {
        reportingFactory.getAllMappings(22)
            .then(mappings => {
                $scope.mappingHistory = {}
                mappings = mappings[0]
                mappings.forEach(e => {
                    if ($scope.mappingHistory.hasOwnProperty(e.target)) {
                        $scope.mappingHistory[e.target].push(e)
                    } else {
                        $scope.mappingHistory[e.target] = [e]
                    }
                })

                $scope.recentMapping = []
                for (let mapping of Object.keys($scope.mappingHistory)) {
                    let version = Math.max(...mappingHistory[mapping].map(e => e.version))
                    $scope.mappingHistory[mapping].forEach(e => {
                        if (e.version === version) $scope.recentMapping.push(e)
                    })
                }
            })
    }

    $scope.openBrowse = function(evt, tabSelection) {
        $scope.sources = null
        $scope.targets = null
            // Declare all variables
        var i, tabcontent, tablinks;

        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // Show the current tab, and add an "active" class to the link that opened the tab
        document.getElementById(tabSelection).style.display = "block";
        evt.currentTarget.className += " active";
    }
    document.getElementById("attributeImpact").style.display = "inline";
    document.getElementById("attributeImpact").className += " active";
});