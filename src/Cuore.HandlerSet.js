CUORE.HandlerSet = CUORE.Class(null, {

    init: function () {
        this.eventNames = [];
        this.handlersForEvent= {};
    },

    register: function(eventName, aHandler) {
        if (!this._contains(eventName))
            this.eventNames.push(eventName);

        var handlersForEvent=this.handlersForEvent[eventName];
        if(!handlersForEvent) {
            handlersForEvent=[];
            this.handlersForEvent[eventName]=handlersForEvent;
        }
        handlersForEvent.push(aHandler);
    },

    notifyHandlers: function(eventName, eventData) {
        var handlersToNotify=this.handlersForEvent[eventName];
        if(!handlersToNotify)
            return;
        for(var i=0, len=handlersToNotify.length;i<len;i++)
            this._safeNotification(handlersToNotify[i], eventData);
    },

    getManagedEvents: function() {
        return this.eventNames;
    },

    _safeNotification: function(handler, eventData) {
        var err;
        try {
            handler.handle(eventData);
        }catch(err) {}
    },

    _contains: function(eventName) {
        for (var i = 0, len=this.eventNames.length; i < this.eventNames.length; i++)
            if (this.eventNames[i] === eventName)
                return true;

        return false;
    }
});
