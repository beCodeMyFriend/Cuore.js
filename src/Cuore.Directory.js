CUORE.Directory = CUORE.Class(null, {

    init: function(baseURL) {
        this.listing = [];
        this.services = {};

        this.setBaseURL(baseURL);
        this._addBuiltinServices();
    },

    add: function (aService) {
        var serviceName = aService.getName();
        this.listing.push(serviceName);
        
        aService.setBaseURL(this.baseURL);
        this.services[serviceName] = aService;
    },

    list: function() {
        return this.listing;
    },

    execute: function(serviceName, procedureName, params, asynchronous) {
        this.getService(serviceName).execute(procedureName, params, asynchronous);
    },
    
    getService: function(serviceName) {
        var service = this._findService(serviceName);
        return service || new CUORE.Services.Null();
    },

    setBaseURL: function(baseURL) {
        this.baseURL = baseURL || '';
        var serviceNames = this.list();
        var numberOfServices = serviceNames.length;
        
        for(var i = 0; i < numberOfServices; i++) {
            this._findService(serviceNames[i]).setBaseURL(this.baseURL);
        }
    },

    _findService: function(serviceName) {
        return this.services[serviceName];
    },

    _addBuiltinServices:function (){
        this.add(new CUORE.Services.Label());
        this.add(new CUORE.Services.Button());
    }
});