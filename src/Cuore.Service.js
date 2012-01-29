CUORE.Service = CUORE.Class(null, {  

    init: function () {
        this.name = 'ABSTRACT';
        this.executionPrefix = 'EXECUTED';
        this.SEPARATOR = '_';
        this.baseURL = '';
    },

    execute: function (procedure, params) {
        var eventName = this.getEventNameForExecution(procedure);
        this[procedure](params, eventName);       
    },

    request: function (url, params, eventName) {
        var paramsData = this.wrapRequestParams(params)
        
        var callback = this._responseCallback(eventName);
        this._doRequest(url, paramsData, callback);
    },
    
    wrapRequestParams: function(params){
        var theMessage = new CUORE.Message();
        theMessage.putMapOnQuery(params);
    
        return theMessage.asJson();
    },

    _doRequest: function (url, paramsData, callback)
    {
        CUORE.Core.request(url, paramsData, callback);
    },
    
    emit: function (eventName, response) {
        var theMessage = this.wrapResponse(response);
        
        var theBus = this.getBus && this.getBus();
        theBus = theBus || CUORE.Bus ;
        
        theBus.emit(eventName, theMessage);
    },
    
    wrapResponse: function(response){
        return new CUORE.Message(response);
    },

    getEventNameForExecution: function (procedure) {
        return this.getName() + this.SEPARATOR + procedure + this.SEPARATOR + this.executionPrefix;
    },

    getName: function () {
        return this.name;
    },

    getBaseURL: function () {
        return this.baseURL;
    },

    setBaseURL: function (baseURL) {
        this.baseURL = baseURL;
    },

    getBus: function () {
        return CUORE.Bus;
    },
    
    _responseCallback: function(eventName) {
        var emit = this.emit;
        
        return function(response) {
            emit(eventName, response);
        }
    }
});