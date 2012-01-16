CUORE.Components.SwitchButton = CUORE.Class(CUORE.Components.Button, {

    init: function (buttonName, activeKey, inactiveKey) {
        CUORE.Components.SwitchButton.parent.init.call(this, buttonName);
        
        this.active = true;
        this.activeLabel = this.text;
        this.inactiveLabel = this.text;
        this.activeKey = activeKey;
        this.inactiveKey = inactiveKey;
        this.renderer = new CUORE.Renderers.SwitchButton();

        this.addLabelHandler(this.activeKey, 'setActiveLabel');
        this.addLabelHandler(this.inactiveKey, 'setInactiveLabel');
    },

    addLabelHandler: function (key, procedure) {
        this.addHandler('LABELS_getLabel_EXECUTED_' + key, new CUORE.Handlers.Executor(procedure))
    },

    draw: function () {
        this.requestLabelText(this.activeKey);
        this.requestLabelText(this.inactiveKey);
        CUORE.Components.SwitchButton.parent.draw.call(this);
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

    setActiveLabel: function (message) {
        this.activeLabel = message.getFromAnswer('text');
        this.updateRender();
    },

    setInactiveLabel: function (message) {
        this.inactiveLabel = message.getFromAnswer('text');;
        this.updateRender();
    },

    getActiveLabel: function () {
        return this.activeLabel;
    },

    getInactiveLabel: function () {
        return this.inactiveLabel;
    },

    getActiveKey: function () {
        return this.activeKey;
    },

    getInactiveKey: function () {
        return this.inactiveKey;
    }
});