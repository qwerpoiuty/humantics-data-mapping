app.factory('dataFactory', function($http) {
    var d = {}
    d.getDatabases = function() {
        //this is going to be a get for database names
        return ["Customers", "Sales", "Banks", "Marketing"]
    }

    d.getSchemas = function(db) {
        //this is going to accept a database as an argument and return a list of schemas
        return ["Schema1", "s2", "s3", "s4"]
    }

    d.getTables = function(schema) {
        //same thing. this is going to be a get function for tables depending on the schema

        return [{
            entity: "Sales Transaction",
            field: "id",
            target_entity: "Sales Order",
            target_field: "Sales UID"
        }, {
            entity: "Sales Transaction",
            field: "id",
            target_entity: "Sales Order",
            target_field: "Sales UID"

        }, {
            entity: "Sales Transaction",
            field: "id",
            target_entity: "Sales Order",
            target_field: "Sales UID"

        }, {
            entity: "Sales Transaction",
            field: "id",
            target_entity: "Sales Order",
            target_field: "Sales UID"

        }, {
            entity: "Sales Transaction",
            field: "id",
            target_entity: "Sales Order",
            target_field: "Sales UID"

        }, {
            entity: "Sales Transaction",
            field: "id",
            target_entity: "Sales Order",
            target_field: "Sales UID"

        }, {
            entity: "Sales Transaction",
            field: "id",
            target_entity: "Sales Order",
            target_field: "Sales UID"

        }, {
            entity: "Sales Transaction",
            field: "id",
            target_entity: "Sales Order",
            target_field: "Sales UID"

        }, {
            entity: "Sales Transaction",
            field: "id",
            target_entity: "Sales Order",
            target_field: "Sales UID"

        }, {
            entity: "Sales Transaction",
            field: "id",
            target_entity: "Sales Order",
            target_field: "Sales UID"

        }, {
            entity: "Sales Transaction",
            field: "id",
            target_entity: "Sales Order",
            target_field: "Sales UID"

        }]
    }
    return d
})