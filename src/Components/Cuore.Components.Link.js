CUORE.Components.Link = CUORE.Class(CUORE.Component, {

    init: function(url,key) {
        CUORE.Components.Link.parent.init.call(this);
        this.url = url;
        this.text = url;
        this.setI18NKey(key);
        this.behave(CUORE.Behaviours.HIJACK);
        this.setRenderer(new CUORE.Renderers.Link())
    },

    getURL: function(){
        return this.url;
    }
});