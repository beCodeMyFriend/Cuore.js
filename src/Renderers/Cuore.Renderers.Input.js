CUORE.Renderers.Input = CUORE.Class(CUORE.Renderer, {

    paint: function (component) {
        CUORE.Renderers.Input.parent.paint.call(this,component);
        
        this.label = CUORE.Dom.createElement('label', null, this.panel);
        
        this.addClass('inputJS');
        
        this.DOMInput = CUORE.Dom.createElement('input', {
            type: component.type 
        }, this.panel);

    },

    updateWhenDrawn: function (component) {
        this.label.innerHTML = component.getText();
        this.DOMInput.value = component.value;
        this.DOMInput.disabled = !component.isEnabled();
        this.showDisabledState(component);
        this.setCurrentClasses();
    },

    getValue: function () {
        return this.panel && this.DOMInput.value;
    }
});
