app.directive('mapping', function($state, dataFactory) {
    return {
        restrict: 'E',
        scope: {
            target: '=',
            source: '=',
            edit: '=',
            temp: '='
        },
        templateUrl: 'js/common/directives/mappingTable/mappingTable.html',
        link: function(scope) {
            scope.systems = dataFactory.getSystems()
            dataFactory.getDatabases().then(function(dbs) {
                scope.dbs = dbs
            })
            scope.editMap = ""
            scope.editMapping = function(string) {
                scope.editSource = true
                scope.temp = scope.displaySource
                console.log(scope.index)
            }

            scope.changeSource = function(index) {
                scope.sourceIndex = index
                scope.displaySource = scope.sources[index]
            }

            scope.$watch('temp.db', function(nv, ov) {
                dataFactory.getSchemas(nv.db_id).then(function(schemas) {
                    scope.schemas = schemas
                })
            })
            scope.$watch('temp.schema', function(nv, ov) {

                dataFactory.getTables(nv.schema_id).then(function(tables) {
                    scope.tables = tables
                })
            })

            scope.$watch('temp.table', function(nv, ov) {
                dataFactory.getAttributesByTableId(nv.table_id).then(function(attrs) {
                    scope.attrs = attrs[0]
                })
            })

            scope.$watch('target', function(nv, ov) {
                // scope.target =nv
            })
            scope.$watch('source', function(nv, ov) {
                scope.sources = nv
                scope.displaySource = nv[0]
                    // scope.source=nv
            })

            scope.$watch('edit', function(nv, ov) {
                if (scope.edit == 'newSource') {
                    scope.temp = {}
                }
            })

        }
    }
})