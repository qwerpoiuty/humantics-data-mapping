app.config(function($stateProvider) {
    $stateProvider.state('admin', {
        url: '/admin',
        templateUrl: 'js/admin/admin.html',
        controller: 'adminCtrl',
        data: {
            authenticate: true
        },
        resolve: {
            user: function(AuthService, $state) {
                return AuthService.getLoggedInUser().then(function(user) {
                    if (user.power_level != 5) $state.transitionTo('home')
                    else return user
                })
            }
        }
    });
});

app.controller('adminCtrl', function($scope, $modal, dataFactory, $state, projectFactory, user, userFactory) {
    $scope.user = user
    $scope.power_levels = [{
        title: 'reader',
        level: 0
    }, {
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
    dataFactory.getSystems().then(systems => $scope.systems = systems[0])
    userFactory.getUsers().then(users => $scope.currentUsers = users[0])
    $scope.systemToBeUpdated = {}
    $scope.dbToBeUpdated = {}
    $scope.schemaToBeUpdated = {}
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
        $scope.userToBeCreated = {}
        $scope.systemToBeCreated = {}
        $scope.dbToBeCreated = {}
        $scope.schemaToBeCreated = {}
        $scope.tableToBeCreated = {}
        $scope.userToBeUpdated = {}
        $scope.systemToBeUpdated = {}
        $scope.dbToBeUpdated = {}
        $scope.schemaToBeUpdated = {}
        $scope.tableToBeUpdated = {}
    }

    $scope.toggle = bool => {
        $scope[bool] = !$scope[bool]
    }
    $scope.getNotification = message => {
        return $modal.open({
            templateUrl: "js/common/modals/notification/notification.html",
            controller: `notification`,
            size: 'sm',
            resolve: {
                message: () => {
                    return message
                }
            }
        })
    }

    $scope.$watch(function() {
        return $scope.selectedSystem.value
    }, function(nv, ov) {
        if (nv !== ov) {
            $scope.systemToBeUpdated.system_business_name = nv.system_business_name
            $scope.systemToBeUpdated.system_name = nv.system_name
            dataFactory.getDatabases(nv.system_id).then(dbs => {
                $scope.dbs = dbs[0]
            })
        }
    })
    $scope.$watch(function() {
        return $scope.selectedDb.value
    }, function(nv, ov) {
        if (nv !== ov) {
            $scope.dbToBeUpdated.db_business_name = nv.db_business_name
            $scope.dbToBeUpdated.db_name = nv.db_name
            dataFactory.getSchemas(nv.db_id).then(function(schemas) {
                $scope.schemas = schemas[0]
            })
        }
    })
    $scope.$watch(function() {
        return $scope.selectedSchema.value
    }, function(nv, ov) {
        if (nv !== ov) {
            $scope.schemaToBeUpdated.schema_business_name = nv.schema_business_name
            $scope.schemaToBeUpdated.schema_name = nv.schema_name
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
    $scope.$watch(function() {
        return $scope.createSchema.value
    }, function(nv, ov) {
        if (nv !== ov) {
            dataFactory.getTables(nv.schema_id).then(function(tables) {
                $scope.currentTables = tables[0]
            })
        }
    })

    //ADMIN CREATES
    $scope.createUser = user => {
        var bool = false
        $scope.currentUsers.forEach(currentUser => {
            if (currentUser.email == user.email) {
                bool = true
            }
        })
        if (bool) return $scope.getNotification(`User already exists`)
        if (user.confirm !== user.password) return $scope.getNotification(`Passwords don\'t match`)

        userFactory.createUser(user).then(() => {
            $scope.getNotification(`User created`)
            $scope.reset()
        })
    }
    $scope.systemCreate = system => {
        var bool = false
        $scope.systems.forEach(currentSystem => {
            if (currentSystem.system_name.toLowerCase() === system.system_name.toLowerCase()) bool = true
        })
        if (bool) return $scope.getNotification(`System already exists.`)

        dataFactory.createSystem(system).then(() => {
            $scope.reset()
            dataFactory.getSystems().then(systems => $scope.systems = systems[0])
            var modalInstance = $scope.getNotification(`Systm Created`)
        })
    }
    $scope.createDatabase = db => {
        var bool = false
        var dbToBeCreated = {
            db_name: db.db_name,
            system: $scope.createSystem.value.system_id,
            db_business_name: db.db_business_name
        }
        $scope.dbs.forEach(currentDb => {
            if (currentDb.db_name.toLowerCase() === dbToBeCreated.db_name.toLowerCase()) bool = true
        })
        if (bool) return $scope.getNotification(`Database already exists`)

        dataFactory.createDatabase(dbToBeCreated).then(() => {
            $scope.reset()
            var modalInstance = $scope.getNotification(`Database created`)
        })
    }
    $scope.schemaCreate = schema => {
        var schemaToBeCreated = {
            schema_name: schema.schema_name,
            db: $scope.createDb.value.db_id,
            schema_business_name: schema.schema_business_name
        }
        var bool = false
        $scope.schemas.forEach(currentSchema => {
            if (currentSchema.schema_name.toLowerCase() === schemaToBeCreated.schema_name.toLowerCase()) bool = true

        })
        if (bool) return $scope.getNotification(`Schema already exists`)

        dataFactory.createSchema(schemaToBeCreated).then(() => {
            $scope.reset()
            var modalInstance = $scope.getNotification(`Schema created`)
        })
    }
    $scope.createTable = function(table) {
        var tableToBeCreated = {
            schema: $scope.createSchema.value.schema_id,
            table_name: table.table_name
        }
        var bool = false
        $scope.currentTables.forEach(currentTable => {
            if (currentTable.table_name.toLowerCase() === tableToBeCreated.table_name.toLowerCase()) {
                bool = true
            }
        })
        if (bool) return $scope.getNotification(`Table already exists`)

        dataFactory.createTable(tableToBeCreated).then(() => {
            $scope.reset()
            var modalInstance = $scope.getNotification(`Table created`)
        })
    }

    //ADMIN EDITS

    $scope.updateSystem = system => {
        var bool = false
        let updatedSystem = {
            system_name: system.system_name,
            system_id: $scope.selectedSystem.value.system_id,
            system_business_name: system.system_business_name
        }
        $scope.systems.forEach(currentSystem => {
            if (currentSystem.system_name.toLowerCase() === updatedSystem.system_name.toLowerCase()) bool = true
        })
        if (system.system_name == $scope.selectedSystem.value.system_name) bool = false
        if (bool) return $scope.getNotification(`Please choose another system name`)

        dataFactory.updateSystem(updatedSystem).then(() => {
            $scope.reset()
            var modalInstance = $scope.getNotification(`System updated`)
        })
    }
    $scope.updateDatabase = db => {
        let updatedDb = {
            db_name: db,
            db_id: $scope.selectedDb.value.db_id,
            db_business_name: db.db_business_name
        }
        var bool = false
        $scope.dbs.forEach(currentDb => {
            if (currentDb.system_name.toLowerCase() === updatedDb.db_name.toLowerCase()) bool = true
        })
        if (system.system_name == $scope.selectedDb.value.db_name) bool = false
        if (bool) return $scope.getNotification(`Please choose another database name`)

        dataFactory.updateDatabase(updatedDb).then(() => {
            $scope.reset()
            var modalInstance = $scope.getNotification(`Database updated`)
        })
    }

    $scope.updateSchema = schema => {
        let updatedSchema = {
            schema_name: schema,
            schema_id: $scope.selectedSchema.value.schema_id,
            schema_business_name: schema.schema_business_name
        }
        var bool = false
        $scope.schemas.forEach(currentSchema => {
            if (currentSchema.schema_name.toLowerCase() === updatedSchema.schema_name.toLowerCase()) {
                bool = true
            }
        })
        if (system.system_name == $scope.selectedSchema.value.schema_name) bool = false
        if (bool) {
            var modalInstance = $scope.getNotification(`Please choose another schema name`)
            return
        }

        dataFactory.updateSchema(updatedSchema).then(() => {
            $scope.reset()
            var modalInstance = $scope.getNotification(`Schema updated`)
        })
    }

    $scope.updateUser = user => {
        if (user.confirm !== user.password) {
            var modalInstance = $scope.getNotification(`Passwords don\'t match`)
            return
        }
        userFactory.updateUser(user).then(response => {
            $scope.reset()
            var modalInstance = $scope.getNotification(`User updated`)
        })
    }
    $scope.adminDelete = (structure, id) => {
        var command = 'delete' + structure
        var modalInstance = $modal.open({
            templateUrl: "js/common/modals/confirmation/confirmation.html",
            controller: `confirmation`,
            size: 'sm',
            resolve: {
                message: () => {
                    return `Delete ${structure}? You cannot undo this.`
                }
            }
        })
        modalInstance.result.then(result => {
            if (!result) return
            dataFactory[command](id).then(() => {
                if (structure == 'System') {
                    dataFactory.getSystems().then(systems => {
                        $scope.systems = systems[0]
                    })
                } else if (structure == 'Table') {
                    dataFactory.getTables($scope.selectedSchema.value.schema_id).then(function(tables) {
                        $scope.tables = tables[0]
                    })
                }
                var modalInstance = $scope.getNotification(`${structure} deleted`)
                $scope.reset()
            })
        })

    }
    $scope.adminLock = (id, table_status) => {
        dataFactory.lockTable(id, table_status).then(() => {
            var modalInstance = $scope.getNotification(`Table updated`)
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
        $scope.reset(0)
    }

    $scope.openBrowse2 = function(evt, tabSelection) {
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
            $scope.reset()
        }
        //detailed view transition


    //extra code added by ND - start
    $scope.openBrowse3 = function(evt, tabSelection) {
            // Declare all variables
            var i, tabcontent, tablinks;

            // Get all elements with class="tabcontent" and hide them
            tabcontent = document.getElementsByClassName("tabcontent3");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }

            // Show the current tab, and add an "active" class to the link that opened the tab
            document.getElementById(tabSelection).style.display = "block";
            evt.currentTarget.className += " active";
            $scope.tables = null
            $scope.reset()
        }
        //extra code added by ND - End

    $scope.detailedView = function(tableId) {
        $state.go('detailed', {
            tableId: tableId
        })
    }

    //extra code added by ND - start
    document.getElementById("createSection").style.display = "block";
    document.getElementById("createSection").className += " active";
    //extra code added by ND - End

    document.getElementById("systemTab").style.display = "block";
    document.getElementById("systemTab").className += " active";
    document.getElementById("systemETab").style.display += "block";
    document.getElementById("systemETab").className += " active";
});
