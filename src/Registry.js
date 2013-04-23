CUORE.Registry = CUORE.Class(null, {

    init: function() {
        this.components = [];
    },

    register: function(component) {
        if (this._contains(component)) return;
        this.components.push(component);
    },


    size: function() {
        return this.components.length;
    },

    each: function(callback) {
        var componentsLength = this.size();
        for (var position = 0; position < componentsLength; position++) {
            callback(this.components[position]);
        }
    },

    _contains: function(component) {
        var NOT_FOUND = -1;
        return (this.components.indexOf(component) !== NOT_FOUND);
    }
});