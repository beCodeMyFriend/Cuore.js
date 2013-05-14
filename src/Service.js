
CUORE.Service = CUORE.Class(null, {

    init: function () {
        this.name = 'ABSTRACT';
        this.executionPrefix = 'EXECUTED';
        this.SEPARATOR = '_';
        this.baseURL = '';
        this.wrapper = new CUORE.Wrapper();
    },

    execute: function (procedure, data) {
        var eventName = this._getEventName(procedure);
        this[procedure](data, eventName);
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

    _emit: function (eventName, response) {
        var theMessage = this.wrapper.wrapResponse(response);
        CUORE.Bus.emit(eventName, theMessage);
    },

    _doRequest: function (url, dataData, callback)
    {
        CUORE.Requests.post(url, dataData, callback);
    },

    _request: function (callee, data, eventName) {
        var dataData = this.wrapper.wrapRequest(data);
        var url = this._buildEndpointUrl(callee);
        var callback = this._responseCallback(eventName);
        this._doRequest(url, dataData, callback);
    },

    _buildEndpointUrl: function(callee) {
        var endpointUrl = this.getBaseURL() + "/" + this.name + "/"+ callee;
        return endpointUrl.toLowerCase();
    },

    _getEventName: function (procedure) {
        return this.getName() + this.SEPARATOR + procedure + this.SEPARATOR + this.executionPrefix;
    },

    _responseCallback: function(eventName) {
        var callback= function(response) {
            this._emit(eventName, response);
        }
        return CUORE.Core.bind(this,callback);;
    }
});
