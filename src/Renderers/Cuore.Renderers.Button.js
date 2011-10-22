CUORE.Renderers.Button = CUORE.Class(CUORE.Renderer, {

    init: function() {
        CUORE.Renderers.Button.super.init.call(this);
        
        this.DOMClass = 'button';
    },

    draw: function(component) {
        this.panel = CUORE.Dom.createElement('a', {
            id: this.innerDivName(component.getName()),
            href: '#'
        }, this.container);
        
        this.span = CUORE.Dom.createElement('span', null, this.panel);

        this.addClass(component.getButtonName());
        this.addClass(this.DOMClass);
        this.updateWhenDrawn(component);
    },

    updateWhenDrawn: function(component) {
        this.putText(component);
        this.setClassCSS(component);
        this.addEvents(component);
        this.setCurrentClasses();
    },

    putText: function(component) {
        var text = (component.getText() || component.getButtonName());
        this.span.innerHTML = text;
    },

    setClassCSS: function(component) {
        this.showDisabledState(component);
    },

    addEvents: function(component) {
        CUORE.Dom.Event.remove(this.panel, 'click');
        CUORE.Dom.Event.stopDefault(this.panel, 'click'); 
        
        if (component.isEnabled()) {
            var componentClick = CUORE.Core.bind(component, component.click);
            CUORE.Dom.Event.add(this.panel, 'click', componentClick);
        }
    }   
});