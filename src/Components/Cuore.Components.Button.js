CUORE.Components.Button = CUORE.Class(CUORE.Component, {

    defaultLabel: 'CLICK!',

    init: function(buttonName, key) {
        CUORE.Components.Button.parent.init.call(this);

        this.service = 'BUTTON';
        this.data = null;
        this.labelKey = key || this.defaultLabel;
        
        this.buttonName = buttonName || 'aButton';
        this.asynchronous = false;
        this.setRenderer(new CUORE.Renderers.Button());
        
        this.setI18NKey(this.labelKey);
    },

    click: function() {
        if(this.service) {
            this.services.execute(this.service, this.buttonName, this.data);
        }
    },

    getButtonName: function() {
        return this.buttonName;
    },

    setData: function(data) {
        this.data = data;
    },
    
    getButtonText: function(){
        return this.getText(this.labelKey);
    }
});