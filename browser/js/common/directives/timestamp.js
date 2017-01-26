app.directive('timestamp', () => {
    return {
        restrict: 'A',
        compile: ($el, $attrs) => {
            console.log($el[0])
        }
    }
})