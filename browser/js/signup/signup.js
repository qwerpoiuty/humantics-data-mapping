app.config(function($stateProvider) {
    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'js/signup/signup.html',
        controller: 'signupCtrl'
    });

})
app.controller('signupCtrl', function($scope, $state, AuthService, userFactory) {

    $scope.signup = function(user) {
        if (user.password !== user.confirm) {
            alert('Passwords do not match')
        } else {
            $scope.error = null;

            userFactory.createUser(user)
                .then(function() {
                    return AuthService.login(user);
                })
                .then(function(user) {
                    $state.go('home', {
                        id: user.id
                    });
                }).catch(function() {
                    $scope.error = 'Invalid signup credentials.';
                });
        }
    };

});