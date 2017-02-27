app.directive('tablenotes', (dataFactory, notificationService) => {
    return {
        restrict: 'E',
        scope: {
            user: '=',
            table: '='
        },
        templateUrl: 'js/common/directives/tableComments/tableComments.html',
        link: (scope, element, attrs) => {

            scope.comments = scope.table.comments ? scope.table.comments : []
            console.log(scope.comments)
            scope.newComment = false
            scope.comment = {}
            scope.comment.poster = scope.user.email
            scope.addComment = function() {
                scope.newComment = !scope.newComment
            }
            scope.hideComment = []
            scope.saveComment = function(comment) {
                scope.comments.push(comment)
                dataFactory.updateTableComments(scope.table.table_id, scope.comments).then(function() {
                    scope.newComment = !scope.newComment
                })
            }

            scope.editComment = function(index) {
                scope.hideComment[index] = 1
            }
            scope.cancel = function(index) {
                scope.hideComment[index] = 0
            }
            scope.updateComment = function(index) {
                scope.comments[index].description = scope.comments[index].newDescription
                delete scope.comments[index].newDescription
                dataFactory.updateTableComments(scope.table.table_id, scope.comments).then(function() {
                    scope.cancel(index)
                })
            }
            scope.deleteComment = function(index) {
                scope.comments.splice(index, 1)
                dataFactory.updateTableComments(scope.table.table_id, scope.comments).then(function() {
                    notificationService.displayNotification('Note Deleted')
                })
            }
        }
    }
})