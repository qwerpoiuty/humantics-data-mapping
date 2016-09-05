app.config(function($stateProvider) {
    $stateProvider.state('detailed', {
        url: '/detailed',
        templateUrl: 'js/outlook-view/outlook-view.html',
        controller: 'detailedCtrl'
    })
});

app.controller('detailedCtrl', function($scope, dataFactory) {
    $scope.selected = {}
    $scope.editing = false
    $scope.selectAttribute = function(attribute) {
        $scope.selected = attribute
        $scope.selected.index = $scope.table.indexOf(attribute)
    }
    $sc
    $scope.addAttribute = function(attribute) {
        $scope.selected = {}
        // dataFactory.addAttribute($scope.table, attribute)
    }
    $scope.editAttribute = function() {
        //toggles the edit state. 
        $scope.editing = !$scope.editing
        console.log($scope.editing)
    }
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].onclick = function() {
            this.classList.toggle("active");
            this.nextElementSibling.classList.toggle("show");
        }
    };
    $scope.table = [{
        name: "location",
        source: {
            database: 1,
            schema: 'banks',
            table: 'transactions',
            sampleValue: 22,
            status: 'complete',
            datatype: 'float',
            lastModified: Date.now(),
            type: 'int',
            description: 'dummy value'
        },
        target: {
            database: 2,
            schema: 'customers',
            table: 'Retail Stores',
            datatype: 'double',
            status: 'complete',
            lastModified: Date.now(),
            type: 'string',
            description: 'more dummy values',
            sampleValue: 'string',
            status: 'complete'
        }
    }, {
        name: "inventory_value",
        source: {
            database: 3,
            schema: 'banks',
            table: 'transactions',
            sampleValue: 22,
            status: 'incomplete',
            datatype: 'int',
            lastModified: Date.now(),
            type: 'int',
            description: 'dummy value'
        },
        target: {
            database: 2,
            schema: 'customers',
            table: 'Retail Stores',
            sampleValue: 'string',
            status: 'complete',
            datatype: 'double',
            lastModified: Date.now(),
            type: 'string',
            description: 'more dummy values'
        }
    }, {
        name: "sales_volume",
        source: {
            database: 1,
            schema: 'banks',
            table: 'transactions',
            sampleValue: 22,
            status: 'complete',
            datatype: 'float',
            lastModified: Date.now(),
            type: 'int',
            description: 'dummy value'
        },
        target: {
            database: 2,
            schema: 'customers',
            table: 'Retail Stores',
            sampleValue: 'string',
            status: 'complete',
            datatype: 'double',
            lastModified: Date.now(),
            type: 'string',
            description: 'more dummy values'
        }
    }, {
        name: "revenue",
        source: {
            database: 1,
            schema: 'banks',
            table: 'transactions',
            sampleValue: 22,
            status: 'complete',
            datatype: 'float',
            lastModified: Date.now(),
            type: 'int',
            description: 'dummy value'
        },
        target: {
            database: 2,
            schema: 'customers',
            table: 'Retail Stores',
            sampleValue: 'string',
            status: 'complete',
            datatype: 'double',
            lastModified: Date.now(),
            type: 'string',
            description: 'more dummy values'
        }
    }, {
        name: "employees",
        source: {
            database: 1,
            schema: 'banks',
            table: 'transactions',
            sampleValue: 22,
            status: 'complete',
            datatype: 'float',
            lastModified: Date.now(),
            type: 'int',
            description: 'dummy value'
        },
        target: {
            database: 2,
            schema: 'customers',
            table: 'Retail Stores',
            sampleValue: 'string',
            status: 'complete',
            datatype: 'double',
            lastModified: Date.now(),
            type: 'string',
            description: 'more dummy values'
        }
    }, {
        name: "costs",
        source: {
            database: 1,
            schema: 'banks',
            table: 'transactions',
            sampleValue: 22,
            status: 'complete',
            datatype: 'float',
            lastModified: Date.now(),
            type: 'int',
            description: 'dummy value'
        },
        target: {
            database: 2,
            schema: 'customers',
            table: 'Retail Stores',
            sampleValue: 'string',
            status: 'complete',
            datatype: 'double',
            lastModified: Date.now(),
            type: 'string',
            description: 'more dummy values'
        }
    }, {
        name: "age",
        source: {
            database: 1,
            schema: 'banks',
            table: 'transactions',
            sampleValue: 22,
            status: 'complete',
            datatype: 'float',
            lastModified: Date.now(),
            type: 'int',
            description: 'dummy value'
        },
        target: {
            database: 2,
            schema: 'customers',
            table: 'Retail Stores',
            sampleValue: 'string',
            status: 'complete',
            datatype: 'double',
            lastModified: Date.now(),
            type: 'string',
            description: 'more dummy values'
        }
    }, {
        name: "start_date",
        source: {
            database: 1,
            schema: 'banks',
            table: 'transactions',
            sampleValue: 22,
            status: 'complete',
            datatype: 'float',
            lastModified: Date.now(),
            type: 'int',
            description: 'dummy value'
        },
        target: {
            database: 2,
            schema: 'customers',
            table: 'Retail Stores',
            sampleValue: 'string',
            status: 'complete',
            datatype: 'double',
            lastModified: Date.now(),
            type: 'string',
            description: 'more dummy values'
        }
    }, {
        name: "manager",
        source: {
            database: 1,
            schema: 'banks',
            table: 'transactions',
            sampleValue: 22,
            status: 'complete',
            datatype: 'float',
            lastModified: Date.now(),
            type: 'int',
            description: 'dummy value'
        },
        target: {
            database: 2,
            schema: 'customers',
            table: 'Retail Stores',
            sampleValue: 'string',
            status: 'complete',
            datatype: 'double',
            lastModified: Date.now(),
            type: 'string',
            description: 'more dummy values'
        }
    }, {
        name: "size",
        source: {
            database: 1,
            schema: 'banks',
            table: 'transactions',
            sampleValue: 22,
            status: 'complete',
            datatype: 'float',
            lastModified: Date.now(),
            type: 'int',
            description: 'dummy value'
        },
        target: {
            database: 2,
            schema: 'customers',
            table: 'Retail Stores',
            sampleValue: 'string',
            status: 'complete',
            datatype: 'double',
            lastModified: Date.now(),
            type: 'string',
            description: 'more dummy values'
        }
    }, {
        name: "last_restock_date",
        source: {
            database: 1,
            schema: 'banks',
            table: 'transactions',
            sampleValue: 22,
            status: 'complete',
            datatype: 'float',
            lastModified: Date.now(),
            type: 'int',
            description: 'dummy value'
        },
        target: {
            database: 2,
            schema: 'customers',
            table: 'Retail Stores',
            sampleValue: 'string',
            status: 'complete',
            datatype: 'double',
            lastModified: Date.now(),
            type: 'string',
            description: 'more dummy values'
        }
    }]
});