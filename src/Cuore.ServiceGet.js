CUORE.ServiceGet = CUORE.Class(CUORE.Service, {

    _doRequest: function (url, paramsData, callback)
    {
        CUORE.Core.requestGet(url, paramsData, callback);
    },
    
    wrapRequestParams: function(params){
       return params;
    },
    
    wrapResponse: function(response){
       var theMessage = new CUORE.Message();
       theMessage.putMapOnAnswer(response);
       return  theMessage;
    },
    
});