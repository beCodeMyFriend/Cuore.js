CUORE.HandlerSet = CUORE.Class(null, {

    init: function() {
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

    getManagedEvents: function() {
        return this.eventNames;
    },
    
    notifyHandlers: function(eventName, eventData) {
        var handlersToNotify = this.handlersForEvent[eventName];
        if (handlersToNotify) this._notify(handlersToNotify,eventData);
    },
    
    _notify: function(handlersToNotify, eventData) {
        for (var i = 0, len = handlersToNotify.length; i < len; i++) {
            this._safeNotification(handlersToNotify[i], eventData);
        }
    },
    
    _safeNotification: function(handler, eventData) {
        handler.handle(eventData);
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