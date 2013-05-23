CUORE.Cache = CUORE.Class(null, {

    init: function() {
        this.cache = {};
    },
    getFromCache: function(key) {
        return this.cache[key];
    },

    putOnCache: function(message) {
        var key= message.query;
        this.cache[key]=message;
    }

});