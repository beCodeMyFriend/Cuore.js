CUORE.Handlers.SetText = CUORE.Class(CUORE.Handler, {

    handle: function (response) {
        var theMessage = response;
        var text = theMessage.getFromAnswer('text');
        var key = theMessage.getFromQuery('key');
        
        if (text && key) this.getOwner().setText(key, text);
    }
});
