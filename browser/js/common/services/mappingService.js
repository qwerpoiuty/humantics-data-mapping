app.service('mappingService', $http => {
    this.setMapping = mapping => {
        if (!mapping[0]) var version = 1
        else var version = mapping[0].version + 1
        var mapping = {
            version: version,
            modifier: scope.user.id,
            source: scope.mapping.sources,
            target: scope.mapping.target
        }
        mapping.transformation_rules = (scope.rules.length) ? scope.rules : null
        return mapping
    }

    return this
})