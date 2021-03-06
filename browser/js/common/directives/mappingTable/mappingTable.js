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
            scope.newSource = {}
            scope.changeSource = function(evt, index) {
                scope.temp.sourceIndex = index
                scope.displaySource = scope.sources[index]
                    // var tablinks = document.getElementsByClassName("source-tab");
                    // for (var i = 0; i < tablinks.length; i++) {
                    //     tablinks[i].className = tablinks[i].className.replace(" active", "");
                    // }
                $('.source-tab').removeClass('active')
                evt.currentTarget.className += " active"
            }
            scope.$watch(() => {
                return scope.editSource.system
            }, (nv, ov) => {
                if (nv !== ov && typeof nv.system_id == Number) {
                    datafactory.getDatabases(nv.system_id).then(dbs => {
                        scope.dbs = dbs[0]
                    })
                }
            })
            scope.$watch(() => {
                return scope.editSource.db
            }, (nv, ov) => {
                if (nv !== ov && typeof nv.db_id == Number) {
                    datafactory.getSchemas(nv.db_id).then(schemas => {
                        scope.schemas = schemas[0]
                    })
                }
            })

            scope.$watch(() => {
                return scope.editSource.schema
            }, (nv, ov) => {
                if (nv !== ov && typeof nv.schema_id == Number) {
                    dataFactory.getTables(nv.schema_id).then(function(tables) {
                        scope.tables = tables[0]
                    })
                }
            })

            scope.$watch(() => {
                return scope.editSource.table
            }, (nv, ov) => {
                if (nv !== ov && typeof nv.table_id == Number) {
                    dataFactory.getAttributesByTableId(nv.table_id).then(function(attrs) {
                        scope.attrs = attrs[0]
                    })
                }
            })

            scope.$watch(() => {
                return scope.editSource.attr
            }, (nv, ov) => {
                if (nv !== ov && typeof nv.attr_id == Number) {
                    scope.editSource.attr.datatype = nv.datatype
                    scope.datatype = nv.datatype
                    scope.temp.source = scope.editSource
                }
            })
            scope.$watch(() => {
                return scope.newSource.system
            }, (nv, ov) => {
                if (nv !== ov) {
                    dataFactory.getDatabases(nv.system_id).then(function(dbs) {
                        scope.dbs = dbs[0]
                    })
                }
            })

            scope.$watch(() => {
                return scope.newSource.db
            }, (nv, ov) => {
                if (nv !== ov) {
                    dataFactory.getSchemas(nv.db_id).then(function(schemas) {
                        scope.schemas = schemas[0]
                    })
                }
            })

            scope.$watch(() => {
                return scope.newSource.schema
            }, (nv, ov) => {
                if (nv !== ov) {
                    dataFactory.getTables(nv.schema_id).then(function(tables) {
                        scope.tables = tables[0]
                    })
                }
            })

            scope.$watch(() => {
                return scope.newSource.table
            }, (nv, ov) => {
                if (nv !== ov) {
                    dataFactory.getAttributesByTableId(nv.table_id).then(function(attrs) {
                        scope.attrs = attrs[0]
                    })
                }
            })
            scope.$watch(() => {
                return scope.newSource.attr
            }, (nv, ov) => {
                if (nv !== ov) {
                    console.log(scope.newSource)
                    scope.temp.source = scope.newSource
                    console.log(scope.temp)
                }
            })

            scope.$watch(() => {
                return scope.source
            }, function(nv, ov) {
                if (nv !== ov) {
                    scope.sources = nv
                    scope.newSource = {}
                    scope.displaySource = nv[0]
                    scope.noSources
                    if (scope.displaySource === undefined) scope.noSources = true
                    else {
                        scope.noSources = false
                        scope.datatype = scope.displaySource.datatype
                    }
                    scope.temp.sourceIndex = 0
                        // scope.source=nv
                }
            })

        }
    }
})