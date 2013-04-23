CUORE.State = CUORE.Class(null, {

    keys: undefined,
    map: undefined,
    NOT_FOUND: -1,

    init: function() {
        this.keys = [];
        this.map = {};
    },

    hasKey: function(key) {
        return this._contains(key) && (this.map[key]!== undefined);
    },

    save: function(key, value) {
        this._addKey(key);
        this.map[key] = value;
    },

    retrieve: function(key) {
        if (!this.hasKey(key)) return undefined;
        return this.map[key];
    },
    

    _addKey: function(key) {
        if (this.hasKey(key)) return;
        this.keys.push(key);
    },

    _contains: function(key) {
        return this.keys.indexOf(key) != this.NOT_FOUND;
    }

});