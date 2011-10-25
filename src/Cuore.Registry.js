CUORE.Registry = CUORE.Class(null, {

    init: function(baseURL) {
       this.components = [];
    },

    register: function (component) {
        if (!this._contains(component))
            this.components.push(component);
    },
    
    _contains: function(component) {
        return this.components.indexOf(component) != -1;  
    },
    
    size: function(){return this.components.length;},
    
    each:function(callback) {
        callback(this.components[0]);
    }
    
    
});