CUORE.Components.Input = CUORE.Class(CUORE.Component, {

    init: function(key, type) {
        CUORE.Components.Input.parent.init.call(this);

        this.setRenderer(new CUORE.Renderers.Input());

        this.labelKey = key;
        this.setI18NKey(this.labelKey);

        this.type = type || 'text';
        this.value = '';
        this.formName = null;
    },

    getValue: function () {
        rendererValue = this.renderer.getValue();
        if (rendererValue == "")
            return "";
        return (rendererValue || this.value);
    },

    setValue: function (value) {
        this.value = value;
        this.updateRender();
    },

    getInputText: function(){
        return this.getText(this.labelKey);
    },

    setFormName: function(aName){
        this.formName = aName;
    },

    getFormName: function(){
        return this.formName;
    }
});
