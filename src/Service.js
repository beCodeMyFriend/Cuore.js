
CUORE.Service = CUORE.Class(null, {

    init: function () {
        this.name = 'ABSTRACT';
        this.executionPrefix = 'EXECUTED';
        this.SEPARATOR = '_';
        this.wrapper = new CUORE.Wrapper();
    },

    execute: function (procedure, data) {
        var eventName = this._getEventName(procedure);
        this[procedure](data, eventName);
    },

    getName: function () {
        return this.name;
    },

    _emit: function (eventName, response) {
        var theMessage = this.wrapper.wrapResponse(response);
        CUORE.Bus.emit(eventName, theMessage);
    },

    _getEventName: function (procedure) {
        return this.getName() + this.SEPARATOR + procedure + this.SEPARATOR + this.executionPrefix;
    },

});
