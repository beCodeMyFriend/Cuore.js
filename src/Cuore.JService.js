CUORE.JService = CUORE.Class(CUORE.Service, {

    _doRequest: function (url, paramsData, callback)
    {
        var theMessage = new CUORE.Message(paramsData.query); //TO TEST
        
        CUORE.Core.requestJSONP(url, theMessage.query, callback);
    },
    
});