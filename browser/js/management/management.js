app.config(function($stateProvider) {
    $stateProvider.state('management', {
        url: '/management',
        templateUrl: 'js/management/management.html',
        controller: 'manageCtrl'
    });
});

app.controller('manageCtrl', function ($scope, AuthService, datafactory) {

});