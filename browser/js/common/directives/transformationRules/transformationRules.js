app.directive('rules', function($state, dataFactory) {
    return {
        restrict: 'E',
        scope: {
            rules: '=',
            target: '='
        },
        templateUrl: 'js/common/directives/transformationRules/transformationRules.html',
        link: function(scope, element, attrs) {
            scope.newRule = false
            console.log(scope.rules)
            scope.addTransformation = function() {
                scope.newRule = !scope.newRule
            }
            console.log(scope.rules)
            scope.saveTransformation = function(transformationRule) {
                scope.rules.push(transformationRule)
                var rules = scope.rules
                dataFactory.updateRules(JSON.stringify(rules), scope.target.attr_id).then(function() {

                })
            }
        }
    }
})