CUORE.Directory = CUORE.Class(null, {

    init: function(baseURL) {
        this.listing=[];
        this.services={};
        this._addBuiltinServices();
    },

    add: function (aService){
        var serviceName=aService.getName();
        this.listing.push(serviceName);
        this.services[serviceName]=aService;
    },
    
    list: function(){return this.listing;},
    
    execute: function(serviceName, procedureName, params, asynchronous){
        this.getService(serviceName).execute(procedureName, params, asynchronous);    
    },
    
    getService:function(serviceName) {
        var service=this.services[serviceName];
        if(!service)
            service=new CUORE.Services.Null();
        return service;
    },
    
    _addBuiltinServices:function (){
        this.add(new CUORE.Services.Label());
        this.add(new CUORE.Services.Button());
    }
});