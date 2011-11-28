CUORE.State = CUORE.Class(null, {

    keys: undefined,
    map: undefined,

    init: function() {
        this.keys = [];
        this.map = {};
    },

    hasKey: function(key) {
        return this.keys.indexOf(key) != -1;
    },

    getKeys: function() {

        var clonedKeys = this.keys.slice(0, this.keys.length);

        return clonedKeys;
    },


    _addKey: function(key) {
        if (this.hasKey(key)) return;

        this.keys.push(key);
    },

    _removeKey: function(key) {
        this.keys.splice(this.keys.indexOf(key), 1);
    },


    save: function(key, value) {


        this._addKey(key);

        this.map[key] = value;

        if (value === undefined) {
            this._removeKey(key);
        }

    },

    retrieve: function(key) {
        if (!this.hasKey(key)) return undefined;
        return this.map[key];
    }
});