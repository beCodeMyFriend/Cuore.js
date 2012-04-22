CUORE.Renderers.SwitchButton = CUORE.Class(CUORE.Renderers.Button, {

    putText: function(component) {
        var text = component.getActiveLabel();
        if (!component.isActive()) {
            text = component.getInactiveLabel();
        }

        this.span.innerHTML = text;
    },

    setClassCSS: function(component) {
        CUORE.Renderers.SwitchButton.parent.setClassCSS.call(this, component);

        if (!this.panel) return;
        var newClass = (component.isActive()) ? 'on' : 'off';
        var oldClass = (component.isActive()) ? 'off' : 'on';

        this.addClass(newClass);
        this.removeClass(oldClass);
    }
});
