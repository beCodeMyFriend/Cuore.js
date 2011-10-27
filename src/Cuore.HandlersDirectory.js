CUORE.HandlersDirectory = CUORE.Class(null, {

    init: function () {
        this.handlers = [];
    },

    add: function(aHandler) {
        if (!this._contains(aHandler))
            this.handlers.push(aHandler);
    },

    _contains: function(aHandler) {
        for (var handler = 0; handler < this.handlers.length; handler++)
            if (this.handlers[handler] === aHandler)
                return true;

        return false;
    },

    
    list: function() {
        return this.handlers;
    }
    
});
