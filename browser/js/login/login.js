app.config(function($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function($scope, AuthService, $state) {
    if (AuthService.isAuthenticated) $state.transitionTo('home')
    $scope.login = {};
    $scope.error = null;
    let attempts = 5
    $scope.sendLogin = function(loginInfo) {

        $scope.error = null;
        if (attempts <= 1) {
            AuthService.lock(loginInfo).then(message => {
                $scope.error = `The account ${loginInfo.email} has been locked. Please contact your administrator`
            })
        } else {
            AuthService.login(loginInfo).then(function() {
                $state.transitionTo('home');
            }).catch(function(err) {
                if (err.message.status == 404) {
                    $scope.error = "That user does not exist"
                } else if (err.message.status == 401) {
                    $scope.error = `Invalid login credentials. The account will be locked in ${attempts} attempts`
                } else if (err.message.status == 400) {
                    $scope.error = `That account has been locked. Please contact your administrator`
                }
                $scope.loginInfo.password = ""
                attempts--
            });
        }

    };
});