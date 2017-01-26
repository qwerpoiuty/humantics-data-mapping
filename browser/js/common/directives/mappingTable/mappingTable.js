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
                // scope.$watch('scope.editSource.system', function(nv, ov) {
                //     console.log(nv)
                //     dataFactory.getDatabases(nv.system_id).then(function(dbs) {
                //         scope.dbs = dbs[0]
                //     })
                // })
            scope.$watch(() => {
                return scope.editSource.system
            }, (nv, ov) => {
                if (nv !== ov) {
                    datafactory.getDatabases(nv.system_id).then(dbs => {
                        scope.dbs = dbs[0]
                    })
                }
            })
            scope.$watch(() => {
                return scope.editSource.db
            }, (nv, ov) => {
                if (nv !== ov) {
                    datafactory.getSchemas(nv.db_id).then(schemas => {
                        scope.schemas = schemas[0]
                    })
                }
            })

            scope.$watch(() => {
                return scope.editSource.schema
            }, (nv, ov) => {
                if (nv !== ov) {
                    dataFactory.getTables(nv.schema_id).then(function(tables) {
                        scope.tables = tables[0]
                    })
                }
            })

            scope.$watch(() => {
                return scope.editSource.table
            }, (nv, ov) => {
                if (nv !== ov) {
                    dataFactory.getAttributesByTableId(nv.table_id).then(function(attrs) {
                        scope.attrs = attrs[0]
                    })
                }
            })

            scope.$watch('scope.editSource.attr', function(nv, ov) {
                scope.editSource.attr.datatype = nv.datatype
                scope.datatype = nv.datatype
                scope.temp.source = scope.editSource
            })

            scope.$watch(() => {
                return scope.editSource.attr
            }, (nv, ov) => {
                if (nv !== ov) {
                    scope.editSource.attr.datatype = nv.datatype
                    scope.datatype = nv.datatype
                    scope.temp.source = scope.editSource
                }
            })

            scope.$watch(() => {
                return scope.temp.system
            }, (nv, ov) => {
                if (nv !== ov) {
                    dataFactory.getDatabases(nv.system_id).then(function(dbs) {
                        scope.dbs = dbs[0]
                    })
                }
            })


            scope.$watch('scope.temp.db', (nv, ov) => {
                dataFactory.getSchemas(nv.db_id).then(function(schemas) {
                    scope.schemas = schemas[0]
                })
            })
            scope.$watch(() => {
                return scope.temp.db
            }, (nv, ov) => {
                if (nv !== ov) {
                    dataFactory.getSchemas(nv.db_id).then(function(schemas) {
                        scope.schemas = schemas[0]
                    })
                }
            })
            scope.$watch('scope.temp.schema', (nv, ov) => {
                dataFactory.getTables(nv.schema_id).then(function(tables) {
                    scope.tables = tables[0]
                })
            })

            scope.$watch(() => {
                return scope.temp.schema
            }, (nv, ov) => {
                if (nv !== ov) {
                    dataFactory.getTables(nv.schema_id).then(function(tables) {
                        scope.tables = tables[0]
                    })
                }
            })

            scope.$watch(() => {
                return scope.temp.table
            }, (nv, ov) => {
                if (nv !== ov) {
                    dataFactory.getAttributesByTableId(nv.table_id).then(function(attrs) {
                        scope.attrs = attrs[0]
                    })
                }
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