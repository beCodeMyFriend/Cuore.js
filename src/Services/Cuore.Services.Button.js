CUORE.Services.Button = CUORE.Class(CUORE.Service, {

    init: function() {
        CUORE.Services.Button.parent.init.call(this);
        
        this.name = 'BUTTON';
        this.executionPrefix = 'CLICKED'; 
    },

    execute: function(procedure, params) {
        var theMessage = new CUORE.Message();
        theMessage.putMapOnQuery(params);

        params || (params = {});
        params.buttonName = procedure;

        theMessage.putOnQuery('buttonName', procedure);

        var eventName = this.getName() + this.SEPARATOR + procedure + this.SEPARATOR + this.executionPrefix;
        this.emit(eventName, theMessage.asJson());
    }
});