CUORE.JService = CUORE.Class(CUORE.Service, {

    _doRequest: function (url, paramsData, callback)
    {
        var theMessage = new CUORE.Message(paramsData.query);
        
        CUORE.Core.requestJSONP(url, theMessage.query, callback);
    },
    
    
    emit: function (eventName, response) {
        
        var theMessage = new CUORE.Message();
        theMessage.putMapOnAnswer(response);
        this.lastDataSent = theMessage;
        
        var theBus = this.getBus && this.getBus();
        theBus= theBus || CUORE.Bus ;
        
        theBus.emit(eventName, theMessage);
    },
    
});