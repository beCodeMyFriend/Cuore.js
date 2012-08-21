CUORE.Components.LabelPanel = CUORE.Class(CUORE.Component, {

    init: function(key, granularity) {
        CUORE.Components.LabelPanel.parent.init.call(this);
        this.setRenderer(new CUORE.Renderers.LabelPanel());

        this.labelKey = key;
        this.setI18NKey(this.labelKey);

        this.addClass('labelPanel');
    },

    getLabelText: function(){
        return this.getText(this.labelKey);
    }
});
