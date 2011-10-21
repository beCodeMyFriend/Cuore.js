CUORE.Handlers.Executor = CUORE.Class(CUORE.Handler, {
    
    init: function (ownerFunction) {
        this.ownerFunction = ownerFunction;
    },
    
    handle: function (params) {
        this.getOwner()[this.ownerFunction](params);
    }
});

