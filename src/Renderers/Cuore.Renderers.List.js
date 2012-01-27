CUORE.Renderers.List = CUORE.Class(CUORE.Renderer, {

    init: function() {
        CUORE.Renderers.List.parent.init.call(this);
        this.setTagName('ul');
    },
    
    paint: function(component) {
        CUORE.Renderers.List.parent.paint.call(this, component);
        this.updateWhenDrawn(component);
    },

    updateWhenDrawn: function(component) {
        this.panel.innerHTML = "";
        for (var i = 0, len = component.size(); i < len; i++) {
            this._addItem(component.item(i), i);
        }
    },
    
    _addItem: function(item) {
        var DOMitem = CUORE.Dom.createElement('li', null, this.panel);
        DOMitem.innerHTML=item;
    },


});