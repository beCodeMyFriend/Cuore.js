CUORE.Components.Input = CUORE.Class(CUORE.Component, {
    
    init: function(key, type) {
        CUORE.Components.Input.super.init.call(this);

        this.setRenderer(new CUORE.Renderers.Input());
        this.setI18NKey(key);

        this.type = type || 'text';
        this.value = '';
        this.disabled = false;
    },

    getValue: function () {
        return (this.renderer.getValue() || this.value);
    },

    setValue: function (value) {
        this.value = value;
        this.updateRender();
    },

    disable: function () {
        this.disabled = true;
        this.updateRender();
    },

    enable: function () {
        this.disabled = false;
        this.updateRender();
    }
});