CUORE.Handlers.setText = CUORE.Class(CUORE.Handler, {

    handle: function (response) {
        var theMessage = response;
        var text = theMessage.getFromAnswer("text");
        
        if (text) this.getOwner().setText(text);
    }
});
