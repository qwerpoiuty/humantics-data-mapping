app.directive('mapping', function($state, dataFactory) {
    return{
        restrict:'E',
        scope:{
            target:'=',
            source:'=',
            edit:'='
        },
        templateUrl:'js/common/directives/mappingTable/mappingTable.html',
        link: function(scope,element,attrs){
            scope.systems = dataFactory.getSystems()
            dataFactory.getDatabases().then(function(dbs){
                scope.dbs = dbs
            })
            scope.$watch('temp.selectedDb', function(nv,ov){

                dataFactory.getSchemas(nv.db_id).then(function(schemas){
                    scope.schemas = schemas
                })
            })
            scope.$watch('temp.selectedSchema', function(nv,ov){

                dataFactory.getTables(nv.schema_id).then(function(tables){

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
                    scope.temp = scope.target
                    console.log(scope.temp)
                }
            })

        }
    }
})