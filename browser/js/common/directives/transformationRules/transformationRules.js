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
            scope.saveTransformation = function(transformationRule, version) {
                console.log(scope.target)
                scope.rules.push(transformationRule)
                var rules = scope.rules

                mappingFactory.updateRules(rules, scope.target.attr_id).then(function() {
                    scope.newRule = !scope.newRule
                })
            }

            scope.deleteRule = function(index) {
                scope.rules.splice(index, 1)
                var rules = scope.rules
                mappingFactory.updateRules(rules, scope.target.attr_id)
            }
            scope.hide = []
            console.log(scope.hide)
            scope.editRule = function(index) {
                scope.hide[index] = 1

            }

            scope.cancel = function(index) {
                scope.hide[index] = 0
            }

            scope.updateRule = function(index) {
                scope.rules[index].description = scope.rules[index].newDescription
                delete scope.rules[index].newDescription
                mappingFactory.updateRules(scope.rules, scope.target.attr_id).then(function() {

                })
            }
        }
    }
})