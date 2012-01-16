CUORE.Components.LabelPanel = CUORE.Class(CUORE.Component, {

    init: function(key, granularity) {
        CUORE.Components.LabelPanel.parent.init.call(this);
        this.setI18NKey(key);
    },
    
    draw: function () {
         CUORE.Components.LabelPanel.parent.draw.call(this);
         
         this.addClass('labelPanel');
    }
});