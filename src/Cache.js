CUORE.Cache = CUORE.Class(null, {

    init: function() {
        this.cache = {};
    },

    retrieve: function(key) {
        return this.cache[key];
    },

    put: function(message) {
        var key= message.query;
        this.cache[key]=message;
    }

});