app.directive('rules', function($state, dataFactory) {
    return {
        restrict: 'E',
        scope: {
            rules: '='
        },
        templateUrl:'js/common/directives/transformationRules/transformationRules.html',
        link: function(scope,element,attrs){
        
        }
    }
})