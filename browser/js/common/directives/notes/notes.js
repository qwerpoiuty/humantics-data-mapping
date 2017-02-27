app.directive('notes', (mappingFactory) => {
    return {
        restrict: 'E',
        scope: {
            notes: '=',
            user: '=',
            mapping: '='
        },
        templateUrl: 'js/common/directives/notes/notes.html',
        link: (scope, element, attrs) => {
            scope.newNote = false
            scope.note = {}
            scope.note.poster = scope.user.email
            scope.noteHide = []
            scope.addNotes = function() {
                scope.newNote = !scope.newNote
            }

            scope.saveNote = function(notes) {
                scope.notes.push(notes)
                mappingFactory.updateNotes(scope.notes, scope.mapping[0].target, scope.mapping[0].version).then(function() {
                    scope.newNote = !scope.newNote
                })
            }

            scope.editNote = function(index) {
                scope.hide[index] = 1
            }
            scope.cancel = function(index) {
                scope.hide[index] = 0
            }
            scope.updateNote = function(index) {
                scope.note[index].description = scope.note[index].newDescription
                delete scope.note[index].newDescription
                var mapping = scope.setMapping()
                mappingFactory.updateMapping(note, scope.mapping.target).then(function() {
                    scope.newRule = !scope.newRule
                })
            }
            scope.deleteNote = function(index) {
                scope.notes.splice(index, 1)
                mappingFactory.updateNotes(scope.notes, scope.mapping[0].target, scope.mapping[0].version).then(function() {
                    scope.newRule = !scope.newRule
                })
            }
        }
    }
})