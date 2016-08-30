app.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'homeCtrl'
    });
});

app.controller('homeCtrl', function($scope) {
    $scope.columns = ["Database", "User", "Date", "Entity"]
    $scope.table = [{
        entity: "Sales Transaction",
        field: "id",
        target_entity: "Sales Order",
        target_field: "Sales UID"

    }, {
        entity: "Sales Transaction",
        field: "id",
        target_entity: "Sales Order",
        target_field: "Sales UID"

    }, {
        entity: "Sales Transaction",
        field: "id",
        target_entity: "Sales Order",
        target_field: "Sales UID"

    }, {
        entity: "Sales Transaction",
        field: "id",
        target_entity: "Sales Order",
        target_field: "Sales UID"

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
});