app.config(function($stateProvider) {
    $stateProvider.state('admin', {
        url: '/admin',
        templateUrl: 'js/admin/admin.html',
        controller: 'adminCtrl',
        data: {
            authenticate: true
        },
        resolve: {
            user: function(AuthService) {
                return AuthService.getLoggedInUser().then(function(user) {
                    return user
                })
            }
        }
    });
});

app.controller('adminCtrl', function($scope, $uibModal, dataFactory, $state, projectFactory, user, userFactory) {
    $scope.user = user
    $scope.searchQuery = ""
    $scope.power_levels = [{
        title: 'mapper',
        level: 1
    }, {
        title: 'reviewer',
        level: 2
    }, {
        title: 'approver',
        level: 3
    }, {
        title: 'manager',
        level: 4
    }]

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
    $scope.reset = () => {
        $scope.selectedSystem = {}
        $scope.selectedDb = {}
        $scope.selectedSchema = {}
        $scope.selectedTable = {}
        $scope.createSystem = {}
        $scope.createDb = {}
        $scope.createSchema = {}
        $scope.sEdit = false
        $scope.dbEdit = false
        $scope.schemaEdit = false
        $scope.tableEdit = false
    }
    $scope.reset()
    $scope.toggle = bool => {
        console.log('hello', bool)
        $scope[bool] = !$scope[bool]
    }

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
            dataFactory.getSchemas(nv.db_id).then(function(schemas) {
                $scope.schemas = schemas[0]
            })
        }
    })
    $scope.$watch(function() {
        return $scope.createSystem.value
    }, function(nv, ov) {
        if (nv !== ov) {

            dataFactory.getDatabases(nv.system_id).then(dbs => {
                $scope.dbs = dbs[0]
            })
        }
    })
    $scope.$watch(function() {
        return $scope.createDb.value
    }, function(nv, ov) {
        if (nv !== ov) {
            dataFactory.getSchemas(nv.db_id).then(function(schemas) {
                $scope.schemas = schemas[0]
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
        //ADMIN CREATES
    $scope.createUser = user => {
        if (user.confirm !== user.password) {
            alert('Passwords don\'t match')
            return
        }
        userFactory.createUser(user).then(() => {
            $scope.reset()
        })
    }
    $scope.createSystem = system => {
        dataFactory.createSystem(system)
    }
    $scope.createDatabase = db => {
        var dbToBeCreated = {
            db_name: db,
            system: $scope.createSystem.value.system_id
        }
        dataFactory.createDatabase(dbToBeCreated)
    }
    $scope.createSchema = schema => {
        var schemaToBeCreated = {
            schema_name: schema,
            db: $scope.createDb.value.db_id
        }
        dataFactory.createSchema(schemaToBeCreated)
    }
    $scope.createTable = function(table) {
        var table = {
            schema: $scope.createSchema.value.schema_id,
            table_name: table
        }
        dataFactory.createTable(table)
    }
    $scope.createAttributes = attributes => {
        dataFactory.createAttribute(attributes)
    }

    //ADMIN EDITS
    $scope.updateSystem = system => {
        let updatedSystem = {
            system_name: system,
            system_id: $scope.selectedSystem.value.system_id
        }
        dataFactory.updateSystem(updatedSystem).then(() => {
            $scope.reset()
        })
    }
    $scope.updateDatabase = db => {
        let updatedDb = {
            db_name: db,
            db_id: $scope.selectedDb.value.db_id
        }
        dataFactory.updateDatabase(updatedDb).then(() => {
            $scope.reset()
        })
    }

    $scope.updateSchema = schema => {
        let updatedSchema = {
            schema_name: schema,
            schema_id: $scope.selectedSchema.value.schema_id
        }
        dataFactory.updateSchema(updatedSchema).then(() => {
            $scope.reset()
        })
    }

    $scope.updateUser = user => {
        if (user.confirm !== user.password) {
            alert('Passwords don\'t match')
            return
        }
        userFactory.updateUser(user).then(response => {
            $scope.reset()
        })
    }
    $scope.adminDelete = (structure, id) => {
        if (structure == 'System') {
            dataFactory.getSystems().then(systems => {
                $scope.systems = systems[0]
            })
        }
        var command = 'delete' + structure
        dataFactory[command](id).then(() => {
            if (structure == 'System') {
                dataFactory.getSystems().then(systems => {
                    $scope.systems = systems[0]
                    $scope.reset()
                })
            }
        })
    }

    $scope.findTables = () => {
        dataFactory.getTables($scope.selectedSchema.value.schema_id).then(function(tables) {
            $scope.tables = tables[0]
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
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // Show the current tab, and add an "active" class to the link that opened the tab
        document.getElementById(tabSelection).style.display = "block";
        evt.currentTarget.className += " active";
        $scope.tables = null
    }

    $scope.openBrowse2 = function(evt, tabSelection) {
            $scope.reset()
                // Declare all variables
            var i, tabcontent, tablinks;

            // Get all elements with class="tabcontent" and hide them
            tabcontent = document.getElementsByClassName("tabcontent2");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }

            // Get all elements with class="tablinks" and remove the class "active"
            tablinks = document.getElementsByClassName("tablinks2");
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

    document.getElementById("adminCreateTab").style.display = "inline";
    document.getElementById("adminCreateTab").className += " active";
    document.getElementById("adminEditTab").style.display += "block";
    document.getElementById("adminEditTab").className += " active";
});