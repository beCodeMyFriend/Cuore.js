CUORE.Renderers.Collapsable = CUORE.Class(CUORE.Renderer, {

    updateWhenDrawn: function(component) {
        CUORE.Renderers.Collapsable.parent.updateWhenDrawn.call(this, component);
        
        this.collapseBehaviour(component);
        this.setCurrentClasses();
    },

    collapseBehaviour: function(component) {
        var COLLAPSED = 'collapsed';
        var UNCOLLAPSED = 'uncollapsed';

        this.removeClass(COLLAPSED);
        this.removeClass(UNCOLLAPSED);

        if (component.isCollapsed()) {
            this.panel.style.height = '0px';
            this.panel.style.overflow = 'hidden';
            this.panel.style.paddding = '0px';
            
            this.addClass(COLLAPSED);
        } else {
            var panelHeight = this.panel.scrollHeight + 'px';
            
            this.panel.style.height = panelHeight;
            this.addClass(UNCOLLAPSED);
        }
    }
});