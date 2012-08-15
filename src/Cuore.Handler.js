CUORE.Handler = CUORE.Class(null, {

    init: function() {
        this.owner = null;
    },

    handle: function(params) {},

    setOwner: function(anObject) {
        this.owner = anObject;
    },

    getOwner: function() {
        return this.owner;
    },

});