app.directive('navbar', function($rootScope, AuthService, AUTH_EVENTS, $state, $location) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function(scope) {

    $scope.isActive = function (viewLocation) { 
        return $location.path().indexOf(viewLocation) == 0;
    };

        //     scope.items = [

        //         {
        //             label: 'Dashboard',
        //             state: '',
        //             auth: true
        //         }, {
        //             label: 'Detailed Search',
        //             state: '',
        //             auth: true
        //         }, {
        //             label: 'Home',
        //             state: '',
        //             auth: true
        //         }
        //     ];

        //     scope.user = null;


        //     scope.isLoggedIn = function() {
        //         return AuthService.isAuthenticated();
        //     };

        //     scope.logout = function() {
        //         AuthService.logout().then(function() {
        //             $state.go('home');
        //         });
        //     };

        //     var setUser = function() {
        //         AuthService.getLoggedInUser().then(function(user) {
        //             scope.user = user;
        //             if (scope.user.firstName) scope.name = user.firstName + " " + user.lastName
        //             else scope.name = "Back"
        //         });
        //     };

        //     var removeUser = function() {
        //         scope.user = null;
        //     };

        //     setUser();

        //     $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
        //     $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
        //     $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    }

});