CUORE.Renderers.Button = CUORE.Class(CUORE.Renderer, {

    init: function() {
        CUORE.Renderers.Button.parent.init.call(this);
        this.setTagName('a');
        this.DOMClass = 'button';
    },

    paint: function(component) {
        this._adjustBehaviour(component);
        CUORE.Renderers.Button.parent.paint.call(this, component);

        this.span = CUORE.Dom.createElement('span', null, this.panel);

        this.addClass(component.getButtonName());
        this.addClass(this.DOMClass);
        this.updateWhenDrawn(component);
    },

    _adjustBehaviour: function(component) {
        var notAnAnchor = this.container.tagName !== 'A';
        if (notAnAnchor && component.doYouHijack()) {
            component.behave(CUORE.Behaviours.APPEND);
        }
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