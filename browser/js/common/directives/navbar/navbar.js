app.directive('navbar', function($rootScope, AuthService, AUTH_EVENTS, $state) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function(scope) {

            scope.items = [

                {
                    label: 'Home',
                    state: 'home',
                    auth: true
                }, {
                    label: 'Projects',
                    state: 'management',
                    auth: true
                }, {
                    label: 'Reporting',
                    state: 'reporting',
                    auth: true
                }
            ];
            scope.headers = {
                detailed: "Detailed Table Breakdown",
                reporting: "Find Reports",
                management: "Manage Projects"
            }
            scope.transition = function(stateName) {
                var transition = $state.go(stateName)
                transition.then(function(currentState) {
                    scope.pagetitle = scope.headers[currentState.name]
                    console.log(scope.pagetitle)
                })
            }

            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                scope.pagetitle = scope.headers[toState.name]
            })
            scope.user = null;


            scope.isLoggedIn = function() {
                return AuthService.isAuthenticated();
            };

            scope.logout = function() {
                AuthService.logout().then(function() {
                    $state.go('home');
                });
            };

            var setUser = function() {
                AuthService.getLoggedInUser().then(function(user) {
                    scope.user = user;

                });
            };

            var removeUser = function() {
                scope.user = null;
            };
            scope.logout = function() {
                AuthService.logout().then(function() {
                    $state.go('login');
                });
            };
            setUser();


            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});