CUORE.Handlers.SwitchCollapseAndUncollapse = CUORE.Class(CUORE.Handler, {

    handle: function (response) {
        var owner = this.owner;
        var isCollapsed = owner.isCollapsed();
        
        return (isCollapsed) ? owner.uncollapse() : owner.collapse();
    }
});
