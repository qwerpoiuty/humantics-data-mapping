app.directive('rules', function($state, mappingFactory) {
    return {
        restrict: 'E',
        scope: {
            rules: '=',
            target: '='
        },
        templateUrl: 'js/common/directives/transformationRules/transformationRules.html',
        link: function(scope, element, attrs) {
            scope.newRule = false

            scope.addTransformation = function() {
                scope.newRule = !scope.newRule
            }
            scope.saveTransformation = function(transformationRule) {
                scope.rules.push(transformationRule)
                var rules = scope.rules
                mappingFactory.updateRules(rules, scope.target.attr_id).then(function() {

                })
            }
        }
    }
})