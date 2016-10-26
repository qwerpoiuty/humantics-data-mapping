app.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'homeCtrl'
    });
});

app.controller('homeCtrl', function($scope, $uibModal, dataFactory, $state) {

    $scope.columns = ["Database", "Schema", "Date", "Entity"]
    $scope.searchQuery = ""
    $scope.clearFilter = function() {
        $('.filter-status').val('');
        $('.footable').trigger('footable_clear_filter');
    };

    $scope.filteringEventHandler = function(e) {
        var selected = $('.filter-status').find(':selected').text();
        if (selected && selected.length > 0) {
            e.filter += (e.filter && e.filter.length > 0) ? ' ' + selected : selected;
            e.clear = !e.filter;
        }
    };

    $scope.filterByStatus = function() {
        $('.footable').trigger('footable_filter', {
            filter: $('#filter').val()
        });
    };

    $scope.filter = {
        status: null
    };

    //ALL THE SEARCHING STUFF

    dataFactory.getDatabases().then(function(dbs) {
        $scope.dbs = dbs
    })

    $scope.selectedSystem = {}

    $scope.$watch(function() {
        return $scope.selectedSystems.value
    }, function(nv, ov) {
        if (nv !== ov) {
            $scope.databases = dataFactory.getDatabases(nv)
        }
    })


    $scope.selectedDb = {}
    $scope.selectedSchema = {}
    $scope.$watch(function() {
        return $scope.selectedDb.value
    }, function(nv, ov) {
        console.log(nv)
        if (nv !== ov) {
            if ($scope.selectedSchema.hasOwnProperty('value')) $scope.selectedSchema = {}
            dataFactory.getSchemas(nv.db_id).then(function(schemas) {
                $scope.schemas = schemas
            })
        }
    })
    $scope.$watch(function() {
        return $scope.selectedSchema.value
    }, function(nv, ov) {
        if (nv !== ov) {

            dataFactory.getTables(nv.schema_id).then(function(tables) {
                $scope.tables = tables
                console.log($scope.tables)
            })
        }
    })

    //search things
    $scope.searchCat = "table"
    $scope.search = function(category, query) {
        switch (category) {
            case "table":
                return dataFactory.getTablesByName(query).then(function(tables) {
                    $scope.tables = tables[0]
                })
            case "entity":
                return dataFactory.attributesByName(query).then(function(tables) {
                    $scope.tables = tables[0]
                })
        }
    }

    $scope.impact = function(type, id) {
        var modalInstance = $uibModal.open({
            templateUrl: 'js/common/modals/impactAnalysis/impact.html',
            controller: 'impactCtrl',
            size: 'lg',
            resolve: {
                impact: function() {
                    return dataFactory.getImpactByTable(id).then(function(impact) {
                        return impact
                    })
                },
                type: function() {
                    return type
                }
            }
        });
    }


    //tab functions
    $scope.openBrowse = function(evt, tabSelection) {

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
        //detailed view transition

    $scope.detailedView = function(tableId) {
            console.log(tableId)
            $state.go('detailed', {
                tableId: tableId
            })
        }
        //ALL THE CREATING STUFF
    $scope.addTable = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'js/common/modals/createTable/modal.html',
            controller: 'createMapCtrl',
            size: 'lg',
            resolve: {
                dbs: function() {
                    return dataFactory.getDatabases()
                },
                attribute: function() {
                    return {
                        database: 'customer',
                        schema: 'store',
                        table: 'sales',
                        attribute: 'customer_id'
                    }
                }
            }
        });

        modalInstance.result.then(function(data) {
            console.log('dismissed')

        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    document.getElementById("SearchTab").style.display = "inline";
    document.getElementById("SearchTab").className += " active";
});