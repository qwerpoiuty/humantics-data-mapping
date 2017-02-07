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
            scope.addNotes = function() {
                scope.newNote = !scope.newNote
            }

            scope.saveNote = function(notes) {
                scope.notes.push(notes)
                mappingFactory.updateMapping(scope.setMap()).then(function() {
                    scope.newNote = !scope.newNote
                })
            }

            scope.setMap = () => {
                let temp = scope.mapping[0].version + 1
                let newSources = []
                scope.mapping.forEach(function(e) {
                    newSources.push(e.attr_id)
                })
                let mapping = {
                    version: temp,
                    modifier: scope.user.id,
                    source: newSources,
                    target: scope.mapping[0].target,
                    transformation_rules: scope.mapping[0].transformation_rules,
                    comments: scope.notes,
                    mapping_status: scope.mapping[0].mapping_status
                }
                return mapping
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
        }
    }
})