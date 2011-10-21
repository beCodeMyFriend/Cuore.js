CUORE.Handler = CUORE.Class(null, {
    
    init: function () {
        this.owner = null;
    },

    handle: function (params) {},

    dispatch: function (params) {
        this.handle(params);
    },

    setOwner: function (anObject) {
        this.owner = anObject;
    },

    getOwner: function () {
        return this.owner;
    },

    getPage: function () {
        return document.page;
    }
}); 