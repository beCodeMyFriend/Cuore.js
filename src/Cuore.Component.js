CUORE.Component = CUORE.Class(null, {

    init: function() {
        this.setHandlerSet(new CUORE.HandlerSet());
        this.name = this._generateUUID();
        this.procedure = 'nullProcedure';
        this.SEPARATOR = '_';
        this.labels = {};
        this.renderer = new CUORE.Renderer();
        this.enabled = true;
        this.behaviour = CUORE.Behaviours.APPEND;
    },

    setHandlerSet: function(handlerSet) {
        this.handlerSet = handlerSet;
    },

    setDirectory: function(directory) {
        this.services = directory;
        this.requestLabelText();
    },

    behave: function(behaviour) {
        this.behaviour = behaviour;
    },

    doYouReplace: function() {
        return this.behaviour === CUORE.Behaviours.REPLACE;
    },

    doYouHijack: function() {
        return this.behaviour === CUORE.Behaviours.HIJACK;
    },

    draw: function() {
        this.renderer.render(this);
    },

    updateRender: function() {
        this.renderer.update(this);
    },

    destroy: function() {
        this.renderer.erase();
        CUORE.Bus.unsubscribe(this, this.getManagedEvents());
    },

    execute: function(theService, theProcedure, params, asynchronous) {
        if (!this.services) throw new Error("Cannot call service. A service directory is not configured");
        this.services.execute(theService, theProcedure, params, asynchronous);
    },

    eventDispatch: function(eventName, params) {
        this.handlerSet.notifyHandlers(eventName, params);
    },

    addHandler: function(eventName, handler) {
        handler.setOwner(this);
        this.handlerSet.register(eventName, handler);
        CUORE.Bus.subscribe(this, eventName);
    },

    addExecHandler: function(eventName, handler) {
        this.addHandler(eventName, new CUORE.Handlers.Executor(handler));
    },

    addClass: function(aClass) {
        this.renderer.addClass(aClass);
    },

    removeClass: function(aClass) {
        this.renderer.removeClass(aClass);
    },

    getText: function(key) {
        if(!key) return null;

        return this.labels[key];
    },

    getName: function() {
        return this.name;
    },

    setName: function(aName) {
        this.name = aName;
    },

    setContainer: function(container) {
        if (this.doYouHijack()) this.setName(container);
        this.renderer.setContainer(container);
    },

    getManagedEvents: function() {
        return this.handlerSet.getManagedEvents();
    },

    setText: function(aKey, aText) {
        this.labels[aKey] = aText;
        this.updateRender();
    },

    setI18NKey: function(key) {
        if (!key) return;

        this.setText(key, key);

        this.addHandler('LABELS_getLabel_EXECUTED_' + key, new CUORE.Handlers.SetText());
        this.requestLabelText(key);
    },

    requestLabelText: function(aKey) {

        if(!aKey){
            for(var key in this.labels){
                this._executeLabelsService(key);
            }
        }
        else{
           this._executeLabelsService(aKey);
        }
    },

    _executeLabelsService:function(aKey){
        if (!this.services) return;
         this.services.execute("LABELS", 'getLabel', {
                key: aKey
            }, true);
    },

    setRenderer: function(renderer) {
        this.renderer = renderer;
    },

    isEnabled: function() {
        return this.enabled;
    },

    enable: function() {
        this.enabled = true;
        this.updateRender();
    },

    disable: function() {
        this.enabled = false;
        this.updateRender();
    },

    addDecoration: function(decoration) {
        if (decoration instanceof CUORE.Decoration) {
            this.renderer.addDecoration(decoration);
        }
    },

    onEnvironmentUp: function() {},

    _generateUUID: function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

});