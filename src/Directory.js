CUORE.Directory = CUORE.Class(null, {

    init: function(baseURL) {
        this.services = {};
        this.setBaseURL(baseURL);
        this._addBuiltinServices();
    },

    add: function(aService) {
        var serviceName = aService.getName();
        aService.setBaseURL && aService.setBaseURL(this.baseURL);
        this.services[serviceName] = aService;
    },

    execute: function(serviceName, procedureName, params) {
        this.getService(serviceName).execute(procedureName, params);
    },

    getService: function(serviceName) {
        var service =this.services[serviceName];
        return service || new CUORE.Services.Null();
    },

    setBaseURL: function(baseURL) {
        this.baseURL = baseURL || '';

        for (var serviceName in this.services) {
            var theService=this.services[serviceName];
            theService.setBaseURL && theService.setBaseURL(this.baseURL);
        }
    },

    _addBuiltinServices: function() {
        this.add(new CUORE.Services.Label());
    }
});