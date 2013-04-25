CUORE.Wrapper = CUORE.Class(null, {


    wrapResponse: function(response){
        return new CUORE.Message(response);
    },

    wrapRequest: function(data){
        var theMessage = new CUORE.Message();
        theMessage.putMapOnQuery(data);
        return theMessage.asJson();
    }

});