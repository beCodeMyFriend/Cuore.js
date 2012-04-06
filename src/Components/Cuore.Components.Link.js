CUORE.Components.Link = CUORE.Class(CUORE.Component, {

    init: function(url,key) {
        CUORE.Components.Link.parent.init.call(this);
        this.url = url;
        this.key = key || url;
        
        this.setI18NKey(this.key);
        this.behave(CUORE.Behaviours.HIJACK);
        this.setRenderer(new CUORE.Renderers.Link())
    },
    
    getLabelText: function(){
        return this.getText(this.key);    
    },

    getURL: function(){
        return this.url;
    }
});