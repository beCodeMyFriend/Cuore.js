CUORE.Renderers.LabelPanel = CUORE.Class(CUORE.Renderer, {


    updateWhenDrawn: function(component) {
        CUORE.Renderers.LabelPanel.parent.updateWhenDrawn.call(this, component);

        this.panel.innerHTML = component.getLabelText();
    }



});
