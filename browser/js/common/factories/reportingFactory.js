app.factory('reportingFactory', function($http) {
    var d = {}

    d.getAllMappings = table_id => {
        return $http.get('/api/mappings/all/' + table_id)
            .then(response => {
                return response.data
            })
    }

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
        return $http.get('/api/mappings/impact/tree/' + tableId)
            .then(function(response) {
                return response.data
            })
    }

    d.getXls = json => {
        var self = this;
        var deferred = $q.defer();
        $http.get('api/mapping/xls', {
            responseType: "arraybuffer"
        }).then(
            function(data, status, headers) {
                var type = headers('Content-Type');
                var disposition = headers('Content-Disposition');
                if (disposition) {
                    var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
                    if (match[1])
                        defaultFileName = match[1];
                }
                defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
                var blob = new Blob([data], {
                    type: type
                });
                saveAs(blob, defaultFileName);
                deferred.resolve(defaultFileName);
            },
            function(data, status) {
                var e = /* error */
                    deferred.reject(e);
            });
        return deferred.promise;
    }

    return d

})

//column is pri
//primay index upi nupi
//primary key
//foreign key