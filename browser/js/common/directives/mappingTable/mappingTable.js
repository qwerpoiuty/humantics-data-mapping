app.directive('mapping', function($state, dataFactory) {
    return{
        restrict:'E',
        scope:{
            target:'=',
            source:'=',
            edit:'=',
            temp:'='
        },
        templateUrl:'js/common/directives/mappingTable/mappingTable.html',
        link: function(scope,element,attrs){
            scope.systems = dataFactory.getSystems()
            

            dataFactory.getDatabases().then(function(dbs){
                scope.dbs = dbs
            })

            scope.$watch('temp.db', function(nv,ov){

                dataFactory.getSchemas(nv.db_id).then(function(schemas){
                    scope.schemas = schemas
                })  
            })
            scope.$watch('temp.schema', function(nv ,ov){

                dataFactory.getTables(nv.schema_id).then(function(tables){
                    scope.tables = tables
                })
            })

            scope.$watch('temp.table', function(nv ,ov){
                dataFactory.getTableById(nv.table_id).then(function(attrs){
                    scope.attrs = attrs[0]
                })
            })
             

            scope.$watch('target',function(nv,ov){
                // scope.target =nv
            })
            scope.$watch('source', function(nv,ov){
                // scope.source=nv
            })
        
            scope.$watch('edit', function(nv,ov){
                // scope.edit=nv
                if(scope.edit == 'editAttribute'){
                    if(scope.source){
                        scope.temp = scope.source
                    }
                    scope.temp.target = scope.target
                }
                console.log('hello',scope.temp)
            })

        }
    }
})