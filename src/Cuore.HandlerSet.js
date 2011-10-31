CUORE.HandlerSet = CUORE.Class(null, {

    init: function () {
        this.eventNames = [];
        this.handlersForEvent = {};
    },

    register: function(eventName, aHandler) {
        if (!this._contains(eventName)) {
            this.eventNames.push(eventName);
        }

        var handlersForEvent = this.handlersForEvent[eventName] || (this.handlersForEvent[eventName] = []);
        handlersForEvent.push(aHandler);
    },

    notifyHandlers: function(eventName, eventData) {
        var handlersToNotify = this.handlersForEvent[eventName];
        if(!handlersToNotify) return;
        
        for(var i = 0, len = handlersToNotify.length; i < len; i++) {
            this._safeNotification(handlersToNotify[i], eventData);
        }
    },

    getManagedEvents: function() {
        return this.eventNames;
    },

    _safeNotification: function(handler, eventData) {
        var err;
        try {
            handler.handle(eventData);
        } catch(err) {}
    },

    _contains: function(eventName) {
        var result = false;
        
        for (var i = 0, len = this.eventNames.length; i < len; i++) {
            if (this.eventNames[i] === eventName) {
                result = true;
                break;
            }
        }
        return result;
    }
});
