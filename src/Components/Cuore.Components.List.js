CUORE.Components.List = CUORE.Class(CUORE.Component, {

    init: function() {
        CUORE.Components.List.parent.init.call(this);
        this.setRenderer(new CUORE.Renderers.List());
        this.list = [];
    },

    fillList: function(list) {
        this.list = list;
        this.updateRender();
    },

    size: function() {
        return this.list.length;
    },

    item: function(index) {
        return this.list[index];
    }
});
