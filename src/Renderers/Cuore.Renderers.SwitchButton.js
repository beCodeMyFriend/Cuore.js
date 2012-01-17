CUORE.Renderers.SwitchButton = CUORE.Class(CUORE.Renderers.Button, {

    putText: function(component) {
        var element = this.span;
        var status  = (component.isActive()) ? 'active' : 'inactive';

        this._putComponentText(component, status, element);
    },
    
    setClassCSS: function (component) {
        CUORE.Renderers.SwitchButton.parent.setClassCSS.call(this, component);
        
        if (!this.panel) return;
        var newClass = (component.isActive()) ? 'on' : 'off';
        var oldClass = (component.isActive()) ? 'off' : 'on';

        this.addClass(newClass);
        this.removeClass(oldClass);
     },

     _putComponentText: function(component, status, element) {
         var label = component[status + 'Label'];
         var key   = component[status + 'Key'];
         var text  = label || key;

         element.innerHTML = text;
     }
});