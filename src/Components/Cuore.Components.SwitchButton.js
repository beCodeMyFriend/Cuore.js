CUORE.Components.SwitchButton = CUORE.Class(CUORE.Components.Button, {

    init: function (buttonName, activeKey, inactiveKey) {
        CUORE.Components.SwitchButton.parent.init.call(this, buttonName);
        
        this.active = true;
        this.activeKey = activeKey || this.defaultLabel;
        this.inactiveKey = inactiveKey || this.defaultLabel;
        this.setI18NKey(this.activeKey);
        this.setI18NKey(this.inactiveKey);
        
        this.renderer = new CUORE.Renderers.SwitchButton();
    },

    click: function (executeParent) {
        var isNotDefined = (typeof executeParent === 'undefined');
        
        if (executeParent || isNotDefined) {
            CUORE.Components.SwitchButton.parent.click.call(this); 
        }

        this.switchState();
    },

    switchState: function () {
        this.active = !this.active;
        this.updateRender();
    },

    isActive: function () {
        return this.active;
    },

    getActiveLabel: function () {
        return this.getText(this.activeKey);
    },

    getInactiveLabel: function () {
        return this.getText(this.inactiveKey);
    }
});