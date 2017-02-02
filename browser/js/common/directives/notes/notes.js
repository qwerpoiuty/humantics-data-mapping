app.directive('notes', () => {
    return {
        restrict: 'E',
        scope: {
            notes: '=',
            user: '=',
            target: '='
        },
        templateUrl: 'js/common/directives/notes/notes.html',
        link: (scope, element, attrs) => {
            scope.newNote = false
            scope.addNotes = function() {
                console.log(scope.sources[0])
                scope.newNote = !scope.newNote
            }
        }
    }
})