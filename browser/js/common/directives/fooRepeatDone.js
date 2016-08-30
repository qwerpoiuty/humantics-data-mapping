app.directive('fooRepeatDone', function() {
    return function($scope, element) {
        if ($scope.$last) { // all are rendered
            $('.table').trigger('footable_redraw');
        }
    }
})