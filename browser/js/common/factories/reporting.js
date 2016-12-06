app.factory('reportingFactory', function($http) {
    var d = {}

    //impact analysis
    d.getImpactByTable = function(tableId) {
        return $http.get('/api/mappings/impact/table/' + tableId)
            .then(function(response) {
                return response.data
            })
    }

    d.getImpactByAttribute = function(attr_id) {
        return $http.get('/api/mappings/impact/attribute/' + attr_id)
            .then(function(response) {
                return response.data
            })
    }

    d.getTree = function(tableId) {
        return $http.get('/api/mappings/impact/tree/' + 2)
            .then(function(response) {
                return response.data
            })
    }

    return d

})

//column is pri
//primay index upi nupi
//primary key
//foreign key
var findChildren = function(tableId) {
    return db.query("select table_name, schema_name, target from tables inner join attributes on attributes.table_id = tables.table_id inner join schemas on tables.schema = schemas.schema_id inner join mappings on attributes.attr_id = any(mappings.source) where tables.table_id = " + tableId)
        .then(function(attributes) {
            attributes = attributes[0]
            var children = attributes.map(function(e) {
                return e.target
            })
            db.query("select schema_name, tables.table_id,table_name from attributes inner join tables on attributes.table_id = tables.table_id inner join schemas on tables.schema = schemas.schema_id where attributes.attr_id = any('{" + children.join(',') + "}')")
                .then(function(attributes) {
                    attributes = attributes[0]
                    var flags = {},
                        child_tables = []
                    for (var i = 0; i < attributes.length; i++) {
                        if (flags[attributes[i].table_id]) continue;
                        flags[attributes[i].table_id] = true;
                        child_tables.push(attributes[i].table_id);
                        tree.push({
                            id: attributes[i].table_id,
                            name: attributes[i].schema_name + "." + attributes[0].table_name,
                            parent: tableId
                        })
                    }
                    if (child_tables.length == 0) {
                        return
                    } else {
                        console.log(child_tables)
                        child_tables.forEach(function(e) {
                            promises.push(findChildren(e))
                        })
                    }
                })

        })
}