CUORE.RemoteService = CUORE.Class(CUORE.Service, {

    init: function () {
        CUORE.RemoteService.parent.init.call(this);
        this.baseURL = '';
    },


    getBaseURL: function () {
        return this.baseURL;
    },

    setBaseURL: function (baseURL) {
        this.baseURL = baseURL;
    },

    _request: function (callee, data, eventName) {
        var dataData = this.wrapper.wrapRequest(data);
        var url = this._buildEndpointUrl(callee);
        var callback = this._responseCallback(eventName);
        this._doRequest(url, dataData, callback);
    },

    _doRequest: function (url, dataData, callback)
    {
        CUORE.Requests.post(url, dataData, callback);
    },

    _buildEndpointUrl: function(callee) {
        var endpointUrl = this.getBaseURL() + "/" + this.name + "/"+ callee;
        return endpointUrl.toLowerCase();
    },

    _responseCallback: function(eventName) {
        var callback= function(response) {
            this._emit(eventName, response);
        }
        return CUORE.Core.bind(this,callback);
    }
});
