CUORE.Components.Collapsable = CUORE.Class(CUORE.Components.Nestable, {

    init: function(service, procedure) {
        CUORE.Components.Collapsable.parent.init.call(this, service, procedure);

        this.collapsed = true;
        this.renderer = new CUORE.Renderers.Collapsable(); // TODO setRenderer or renderer?
        this.addClass('collapsablePanel');
    },

    isCollapsed: function() {
        return this.collapsed;
    },

    uncollapse: function() {
        this.collapsed = false;
        this.updateRender();
    },

    collapse: function() {
        this.collapsed = true;
        this.updateRender();
    }
});