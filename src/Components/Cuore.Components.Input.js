CUORE.Components.Input = CUORE.Class(CUORE.Component, {
    
    init: function(key, type) {
        CUORE.Components.Input.parent.init.call(this);

        this.setRenderer(new CUORE.Renderers.Input());
        this.setI18NKey(key);

        this.type = type || 'text';
        this.value = '';
    },

    getValue: function () {
        return (this.renderer.getValue() || this.value);
    },

    setValue: function (value) {
        this.value = value;
        this.updateRender();
    }
});