CUORE.Renderers.Link = CUORE.Class(CUORE.Renderer, {

    init: function() {
        CUORE.Renderers.Link.parent.init.call(this);
        
        this.DOMClass = 'link';
        this.anchor = undefined;
        this.span = undefined;
    },

    paint: function(component) {

        this._createAnchor(component);
        var target = this.container;
        
        if (!component.doYouHijack()){
            this.anchor.id  = this.innerDivName(component.getName());
            target = this.anchor;   
        }
        
        this.panel = target;        
        this.addClass(this.DOMClass);
        this.updateWhenDrawn(component);
    },

    updateWhenDrawn: function(component) {
        this.putText(component);
        this.setClassCSS(component);
        this.setCurrentClasses();
    },

    showDisabledState: function(component) {
        
        this.anchor.href = component.getURL();
        this.removeClass("disabled");
        
        if (!component.isEnabled()) {
            this.addClass("disabled");
            this.anchor.href = '';
        }
    },


    putText: function(component) {
        this.span.innerHTML = component.getText();
    },

    setClassCSS: function(component) {
        this.showDisabledState(component);
    },
    
    _createAnchor: function (component)
    {
        this.anchor = CUORE.Dom.createElement('a', {
            href: component.getURL()
        }, this.container);        
 
        this.span = CUORE.Dom.createElement('span', null, this.anchor);
    }    

});