app.config(function($stateProvider) {
    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'js/signup/signup.html',
        controller: 'signupCtrl'
    });

})
app.controller('signupCtrl', function($scope, dataFactory, $state, AuthService) {

    $scope.teacher = true

    $scope.signup = function(user) {
        console.log('hello')
        if (user.password !== user.confirm) {
            alert('Passwords do not match')
        } else {
            $scope.error = null;

            user.powerLevel = 1
            userFactory.createUser(user)
                .then(function() {
                    return AuthService.login(user);
                })
                .then(function(user) {
                    $state.go('profile', {
                        id: user.id
                    });
                }).catch(function() {
                    $scope.error = 'Invalid signup credentials.';
                });
        }
    };

});