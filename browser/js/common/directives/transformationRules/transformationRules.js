app.directive('rules', function($state, mappingFactory) {
    return {
        restrict: 'E',
        scope: {
            rules: '=',
            mapping: '=',
            user: '='
        },
        templateUrl: 'js/common/directives/transformationRules/transformationRules.html',
        link: function(scope, element, attrs) {
            scope.newRule = false
            scope.addTransformation = function() {
                if (scope.mapping.length === 0) alert("Please specify a source first")
                else scope.newRule = !scope.newRule
            }
            scope.saveTransformation = function(transformationRule, version) {

                scope.rules.push(transformationRule)
                mappingFactory.updateMapping(scope.setMap()).then(function() {
                    scope.newRule = !scope.newRule
                })
            }

            scope.deleteRule = function(index) {
                scope.rules.splice(index, 1)
                mappingFactory.updateMapping(rules, scope.mapping.target).then(function() {
                    scope.newRule = !scope.newRule
                })
            }
            scope.hide = []
            scope.setMap = () => {
                let temp = scope.mapping[0].version + 1
                let mapping = {
                    version: temp,
                    modifier: scope.user.id,
                    source: scope.mapping,
                    target: scope.mapping[0].target,
                    transformation_rules: scope.rules
                }
                return mapping
            }
            scope.editRule = function(index) {
                scope.hide[index] = 1

            }

            scope.cancel = function(index) {
                scope.hide[index] = 0
            }

            scope.updateRule = function(index) {
                scope.rules[index].description = scope.rules[index].newDescription
                delete scope.rules[index].newDescription
                var mapping = scope.setMapping()
                mappingFactory.updateMapping(rules, scope.mapping.target).then(function() {
                    scope.newRule = !scope.newRule
                })
            }


        }
    }
})