app.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'homeCtrl'
    });
});

app.controller('homeCtrl', function($scope, $uibModal, dataFactory) {
    $scope.columns = ["Database", "Schema", "Date", "Entity"]
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

    $scope.searches = ["Tables", "Attributes"]

    $scope.setSearch = function(search) {
        $scope.searchCat = search
    }
    $scope.dbs = dataFactory.getDatabases()
    $scope.setSchema = function(schema) {
        $scope.selectedSchema = schema
    }

    $scope.itemArray = [{
        id: 1,
        name: 'first'
    }, {
        id: 2,
        name: 'second'
    }, {
        id: 3,
        name: 'third'
    }, {
        id: 4,
        name: 'fourth'
    }, {
        id: 5,
        name: 'fifth'
    }, ];

    $scope.selectedDb = {}
    $scope.$watch(function() {
        return $scope.selectedDb.value
    }, function(nv, ov) {
        if (nv !== ov) {
            $scope.schemas = dataFactory.getSchemas(nv)
        }
    })
    $scope.$watch(function() {
        return $scope.selectedSchema
    }, function(nv, ov) {
        if (nv !== ov) {
            $scope.table = dataFactory.getTables()
        }
    })

    $scope.openBrowse = function(evt, tabselection) {
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
    document.getElementById(tabselection).style.display = "block";
    evt.currentTarget.className += " active";
}

    //ALL THE CREATING STUFF
    $scope.addTable = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'js/common/modals/createMapping/modal.html',
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
});