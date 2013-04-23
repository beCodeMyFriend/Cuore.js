CUORE.HandlerSet = CUORE.Class(null, {

    init: function() {
        this.eventNames = [];
        this.handlersForEvent = {};
    },

    register: function(eventName, aHandler) {
        this._registerEvent(eventName);
        this.handlersForEvent[eventName].push(aHandler);
    },

    getManagedEvents: function() {
        return this.eventNames;
    },

    notifyHandlers: function(eventName, eventData) {
        var handlersToNotify = this.handlersForEvent[eventName];
        this._notify(handlersToNotify, eventData);
    },

    _registerEvent: function(eventName) {
        if (this._contains(eventName)) return;
        this.eventNames.push(eventName);
        this.handlersForEvent[eventName] = [];
    },

    _notify: function(handlersToNotify, eventData) {
        if (!handlersToNotify) return;
        for (var i = 0, len = handlersToNotify.length; i < len; i++) {
            handlersToNotify[i].handle( eventData);
        }
    },

    _contains: function(eventName) {
        for (var i = 0, len = this.eventNames.length; i < len; i++) {
            if (this.eventNames[i] === eventName) {
                return true;
            }
        }
        return false;
    }
});