CUORE.Service = CUORE.Class(null, {  

    init: function () {
        this.name = 'ABSTRACT';
        this.executionPrefix = 'EXECUTED';
        this.SEPARATOR = '_';
        this.lastDataSent = null;
        this.baseURL = '';
    },

    execute: function (procedure, params, asynchronous) {
        var eventName = this.getEventNameForExecution(procedure);
        this[procedure](params, eventName);
       
        var theMessage = new CUORE.Message();
        theMessage.putMapOnQuery(params);
        this.lastDataSent = theMessage;

        if (!asynchronous) {
            this.emit(eventName, theMessage.asJson());
        }
    },

    request: function (url, params, eventName) {
        var theMessage = new CUORE.Message();
        theMessage.putMapOnQuery(params);
        this.lastDataSent = theMessage;
        
        var paramsData = {'query': theMessage.asJson()};
        
        var callback = this._responseCallback(eventName);
        
        CUORE.Core.request(url, paramsData, callback);
    },

    emit: function (eventName, response) {
        var theMessage = new CUORE.Message(response);
        this.lastDataSent = theMessage;
        this.getBus().emit(eventName, theMessage);
    },

    getEventNameForExecution: function (procedure) {
        return this.getName() + this.SEPARATOR + procedure + this.SEPARATOR + this.executionPrefix;
    },

    getName: function () {
        return this.name;
    },

    getLastDataSent: function () {
        return this.lastDataSent;
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