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
});