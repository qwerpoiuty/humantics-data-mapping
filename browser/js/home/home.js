app.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'homeCtrl',
        data: {
            authenticate: true
        },
        resolve: {
            user: function(AuthService) {
                return AuthService.getLoggedInUser().then(function(user) {
                    return user
                })
            },
            assignedMappings: (AuthService, projectFactory) => {
                return AuthService.getLoggedInUser()
                    .then(user => {
                        return projectFactory.getAssignedMappings(user)
                    }).then(assignedMappings => {
                        return assignedMappings
                    })
            }
        }
    });
});

app.controller('homeCtrl', function($scope, $uibModal, dataFactory, $state, projectFactory, user, assignedMappings, notificationService) {
    $scope.user = user
    $scope.assignedMappings = assignedMappings[0]
    $scope.searchQuery = ""
    projectFactory.getAssignedMappings(user)
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

    dataFactory.getSystems().then(systems => {
        $scope.systems = systems[0]
    })

    $scope.selectedSystem = {}
    $scope.selectedDb = {}
    $scope.createdSystem = {}
    $scope.createdDb = {}
    $scope.createdSchema = {}
    $scope.selectedSchema = {}

    $scope.$watch(function() {
        return $scope.selectedSystem.value
    }, function(nv, ov) {
        if (nv !== ov) {

            dataFactory.getDatabases(nv.system_id).then(dbs => {
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

    //search things
    $scope.searchCat = "table"

    $scope.browse = () => {
        if (!$scope.selectedSchema.value) {
            $scope.error = 'Please select a system, database and schema first'
            return
        }
        dataFactory.getTables($scope.selectedSchema.value.schema_id).then((tables) => {
            $scope.tables = tables[0]
        })
    }
    $scope.search = function(category, query) {
        $scope.error = "Searching..."
        $scope.tables = null
        switch (category) {
            case "table":
                return dataFactory.getTablesByName(query).then(function(tables) {
                    if (tables[0].length == 0) {
                        $scope.error = "Sorry! We couldn't find the table you were looking for."
                        return
                    }
                    $scope.tables = tables[0]
                    $scope.error = null
                })
            case "entity":
                return dataFactory.attributesByName(query).then(function(tables) {
                    if (tables[0].length == 0) {
                        $scope.error = "Sorry! We couldn't find the table you were looking for."
                        return
                    }
                    $scope.tables = tables[0]
                    $scope.error = null
                })
        }
    }



    $scope.createTable = function() {
        var table = {
            schema: $scope.createdSchema.value.schema_id,
            table_name: $scope.createdTable
        }
        dataFactory.createTable(table).then(function(table) {
            dataFactory.getMostRecentTable().then(function(table_id) {
                $scope.detailedView(table_id)
            })
        })
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
        tablinks = document.getElementsByClassName("btn-tab");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // Show the current tab, and add an "active" class to the link that opened the tab
        document.getElementById(tabSelection).style.display = "block";
        evt.currentTarget.className += " active";
        $scope.tables = null
    }


    //detailed view transition

    $scope.detailedView = function(tableId) {
        $state.go('detailed', {
            tableId: tableId
        })
    }

    document.getElementById("SearchTab").style.display = "inline";
    document.getElementById("SearchTab").className += " active";
    document.getElementById("ActionsTab").style.display += "block";
    document.getElementById("ActionsTab").className += " active";
});