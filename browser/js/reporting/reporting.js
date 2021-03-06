app.config(function($stateProvider) {
    $stateProvider.state('reporting', {
        url: '/reporting',
        templateUrl: 'js/reporting/reporting.html',
        controller: 'reportCtrl',
        data: {
            authenticate: true
        }

    })
});

app.controller('reportCtrl', function($scope, dataFactory, AuthService, reportingFactory, $uibModal, $state, notificationService) {
    dataFactory.getSystems().then(function(systems) {
        $scope.systems = systems[0]
    })

    $scope.impactSearches = []
    $scope.selectedSystem = {}
    $scope.selectedMappings = {}
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
                attributes = attributes[0]
                var mappingHistory = {}
                attributes.forEach(e => {
                    if (mappingHistory.hasOwnProperty(e.target)) {
                        mappingHistory[e.target].push(e)
                    } else {
                        mappingHistory[e.target] = [e]
                    }
                })
                var recentMappings = []
                for (let mapping of Object.keys(mappingHistory)) {
                    let version = Math.max(...mappingHistory[mapping].map(e => e.version))
                    mappingHistory[mapping].forEach(e => {
                        if (e.version === version) recentMappings.push(e)
                    })
                }
                $scope.targets = recentMappings
                console.log($scope.targets)
            })
    }

    $scope.nextImpact = function(attr_id) {
        $scope.impactSearches.push($scope.sources)
        $scope.sources = null
        $scope.sources = $scope.targets
        $scope.targets = null
        $scope.impact(attr_id)
    }

    $scope.previousImpact = function() {
        if ($scope.impactSearches.length == 1) return
        $scope.impactSearches.pop()
        $scope.sources = $scope.impactSearches[$scope.impactSearches.length - 1]
        $scope.targets = []
    }

    $scope.tableImpact = function(table) {

        reportingFactory.getTree(table.table_id).then(tree => {
            if (!tree) {
                var modalinstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'js/common/modals/notification/notification.html',
                    controller: 'notification',
                    backdrop: 'static',
                    keyboard: false,
                    size: "sm",
                    resolve: {
                        message: function() {
                            return `This table is not referenced as a source`
                        }
                    }
                })
            } else {
                let unflatten = arr => {
                    var map = {},
                        node = {},
                        roots = [];
                    for (var i = 0; i < arr.length; i += 1) {
                        node = Object.assign({}, arr[i]);
                        node.children = [];
                        map[node.id] = node
                        if (node.parent) {
                            map[node.parent].children.push(node);
                        } else {
                            roots.push(node);
                        }
                    }
                    return roots
                }
                $scope.tree = unflatten(tree)
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'js/common/modals/impactTree/impactTree.html',
                    controller: 'impactTreeCtrl',
                    backdrop: 'static',
                    keyboard: false,
                    size: "lg",
                    resolve: {
                        tree: function() {
                            return $scope.tree;
                        }
                    }
                });

            }
        })
    }

    $scope.totalMappings = table => {
        if (!table) {
            notificationService.displayNotification('Please select a table first')
            return
        } else {
            $scope.error = "Searching"
            reportingFactory.getAllMappings(table.table_id)
                .then(mappings => {
                    console.log(mappings)
                    if (mappings[0].length == 0) $scope.error = "That table has no mappings"
                    else {
                        mappings = mappings[0]
                        $scope.recentMapping = mappings
                        $scope.allMapping = true
                        $scope.error = null
                    }
                })
        }
    }
    $scope.getXls = () => {
        $scope.arr = []
        console.log($scope.selectedMappings)
        for (const key of Object.keys($scope.selectedMappings)) {
            if ($scope.selectedMappings[key].selected == true) $scope.arr.push($scope.recentMapping[key])
        }
        alasql('SELECT * INTO XLSX("mappings.xlsx",{headers:true}) FROM ?', [$scope.arr]);

    }

    $scope.transition = () => {
        $state.go('detailed', {
            tableId: $scope.selectedTable.value.table_id
        })
    }

    $scope.openBrowse = function(evt, tabSelection) {
        $scope.sources = null
        $scope.targets = null
        $scope.allMapping = false
            // Declare all variables
        var i, tabcontent, tablinks;

        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("btn-tab");
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