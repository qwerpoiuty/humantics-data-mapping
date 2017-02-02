app.directive('notes', () => {
    return {
        restrict: 'E',
        scope: {
            comments: '=',
            user: '=',
            target: '='
        },
        templateUrl: 'js/common/directives/notes/notes.html',
        link: (scope, element, attrs) => {
            scope.newNote = false
            scope.addNotes = function() {
                //Remember to force check on whether tables can be modified by other mappers
                scope.newNote = !scope.newNote
            }
        }
    }
})