CUORE.Registry = CUORE.Class(null, {

    init: function() {
        this.components = [];
    },

    register: function(component) {
        if (!this._contains(component)) {
            this.components.push(component);
        }
    },

    _contains: function(component) {
        return (this.components.indexOf(component) !== -1);
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

    filterByName: function(name) {
        var selectedComponent = null;
        this.each(function(component) {
            if(component.getName() === name) selectedComponent = component;
        });
        return selectedComponent;
    }
});