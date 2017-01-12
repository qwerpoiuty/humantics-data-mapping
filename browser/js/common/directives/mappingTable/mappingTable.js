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
            dataFactory.getSystems().then(systems => {
                scope.systems = systems[0]
            })

            scope.editMap = ""
            scope.editSource = {}
            scope.changeSource = function(index) {
                scope.temp.sourceIndex = index
                scope.displaySource = scope.sources[index]
            }
            scope.$watch('editSource.system', function(nv, ov) {
                dataFactory.getDatabases(nv.system_id).then(function(dbs) {
                    scope.dbs = dbs[0]
                })
            })
            scope.$watch('editSource.db', function(nv, ov) {
                dataFactory.getSchemas(nv.db_id).then(function(schemas) {
                    scope.schemas = schemas[0]
                })
            })
            scope.$watch('editSource.schema', function(nv, ov) {

                dataFactory.getTables(nv.schema_id).then(function(tables) {
                    scope.tables = tables[0]
                })
            })
            scope.$watch('editSource.table', function(nv, ov) {
                dataFactory.getAttributesByTableId(nv.table_id).then(function(attrs) {
                    scope.attrs = attrs[0]
                })
            })
            scope.$watch('editSource.attr', function(nv, ov) {
                scope.editSource.attr.datatype = nv.datatype
                scope.datatype = nv.datatype
                scope.temp.source = scope.editSource
            })
            scope.$watch('temp.system', (nv, ov) => {
                dataFactory.getDatabases(nv.system_id).then(function(dbs) {
                    scope.dbs = dbs[0]
                })
            })
            scope.$watch('temp.db', (nv, ov) => {
                dataFactory.getSchemas(nv.db_id).then(function(schemas) {
                    scope.schemas = schemas[0]
                })
            })
            scope.$watch('temp.schema', (nv, ov) => {
                dataFactory.getTables(nv.schema_id).then(function(tables) {
                    scope.tables = tables[0]
                })
            })
            scope.$watch('temp.table', (nv, ov) => {
                dataFactory.getAttributesByTableId(nv.table_id).then(function(attrs) {
                    scope.attrs = attrs[0]
                })
            })



            scope.$watch('source', function(nv, ov) {
                scope.sources = nv
                scope.displaySource = nv[0]
                scope.noSources
                scope.temp = {}
                if (scope.displaySource === undefined) scope.noSources = true
                else {
                    scope.noSources = false
                    scope.datatype = scope.displaySource.datatype
                }
                scope.temp.sourceIndex = 0
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