CUORE.Component = CUORE.Class(null, {

    init: function() {
        this.name = 'aComponent'; 
        this.service = 'NULL';
        this.procedure = 'nullProcedure';
        this.I18NKey = null;
        this.handlers = {};
        this.SEPARATOR = '_';
        this.text = '';
        this.renderer = new CUORE.Renderer();
        this.enabled = true;
        this.replaces = true;
    },

    setDirectory: function(directory) {
        this.services = directory;
        this._requestLabelText();
    },

    initializeExecutionContext: function(service, procedure) {
        if (service && procedure) {
            this.service = service;
            this.procedure = procedure;
        }
    },

    doYouReplace:function(){
        return this.replaces;    
    },
    
    dontReplace: function() {
      this.replaces = false;
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
        if(!this.services)
          throw new Error("Cannot call service. A service directory is not configured");
        this.services.execute(theService, theProcedure, params, asynchronous);
    },

    eventDispatch: function(eventName, params) {
        var eventsToDispatch = this.handlers[eventName];
        if (!eventsToDispatch) return;

        for (var i = 0, len = eventsToDispatch.length; i < len; i++) {
            eventsToDispatch[i].handle(params);
        }
    },

    addHandler: function(eventName, handler) {
        this.handlers[eventName] = this.handlers[eventName] || [];
        handler.setOwner(this);
        this.handlers[eventName].push(handler);
    },

    addClass: function(aClass) {
        this.renderer.addClass(aClass);
    },

    removeClass: function(aClass) {
        this.renderer.removeClass(aClass);
    },

    getText: function() {
        return this.text;
    },

    getName: function() {
        return this.name;
    },

    setName: function(aName) {
        this.name = aName;
    },
    
    setContainer: function(container) {
        this.renderer.setContainer(container);
    },

    getContainer: function() {
        return this.renderer.getContainer();
    },

    getUniqueID: function() {
        return this.renderer.innerDivName(this.name);
    },

    getManagedEvents: function() {
        var handlersKeys = [];
        for (var handler in this.handlers) {
            if (CUORE.Core.isOwnProperty(this.handlers, handler)) {
                handlersKeys.push(handler);
            }
        }
        return handlersKeys;
    },

    setText: function(aText) {
        this.text = aText;
        this.updateRender();
    },

    setI18NKey: function(key) {
        if (!key) return;

        this.I18NKey = key;
        this.setText(this.I18NKey);

        this._requestLabelText();
    },

    requestLabelText:function(key) {
        if(!key)
            return;

        if(this.services)
          this.services.execute("LABELS", 'getLabel', {key: key}, true);
    },

    _requestLabelText:function() {
        if(!this.I18NKey)
            return;
      
        this.addHandler('LABELS_getLabel_EXECUTED_' + this.I18NKey, new CUORE.Handlers.setText());
        CUORE.Bus.subscribe(this, 'LABELS_getLabel_EXECUTED_' + this.I18NKey);

        this.requestLabelText(this.I18NKey);
    },

    getI18NKey: function() {
        return this.I18NKey;
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
    }
});
