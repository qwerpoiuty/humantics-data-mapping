app.config(function($stateProvider) {
    $stateProvider.state('management', {
        url: '/management',
        templateUrl: 'js/management/management.html',
        controller: 'manageCtrl'
    });
});

app.controller('manageCtrl', function($scope, dataFactory, AuthService) {
    dataFactory.getDatabases().then(function(dbs) {
        $scope.dbs = dbs
    })

    $scope.selectedDb = {}
    $scope.selectedSchema = {}
    $scope.selectedTable = {}
    $scope.$watch(function() {
        return $scope.selectedDb.value
    }, function(nv, ov) {
        if (nv !== ov) {
            if ($scope.selectedSchema.hasOwnProperty('value')) $scope.selectedSchema = {}
            console.log('hello')
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
            })
        }
    })

    $scope.$watch(function() {
            return $scope.selectedTable.value
        }, function(nv, ov) {
            if (nv !== ov) {
                dataFactory.getImpactByTable(nv.table_id).then(function(attributes) {
                    $scope.impactCategory = "table"
                    $scope.souces = [nv]
                    $scope.attributes = attributes[0]
                })
            }
        })
        //search stuff
    $scope.searchQuery = ""
    $scope.attributeSearch = function(query) {
        dataFactory.getTablesByAttribute(query).then(function(attributes) {
            $scope.searchCat = "attribute"
            $scope.sources = attributes[0]
            console.log($scope.sources)
        })
    }


    $scope.impact = function(attr_id) {
        console.log('hello')
        dataFactory.getImpactByAttribute(attr_id)
            .then(function(attributes) {
                $scope.attributes = attributes[0]
            })
    }

    $scope.targetImpact = function(source) {
        $scope.sources = [source]
        dataFactory.getImpactByAttribute(source.attr_id)
            .then(function(attributes) {
                $scope.attributes = attributes[0]
            })
    }


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
    document.getElementById("ProjectTab").style.display = "inline";
    document.getElementById("ProjectTab").className += " active";

});