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
        this.render();
        this.getLabel();
    },

    render: function() {
        this.renderer.render(this);
    },

    updateRender: function() {
        this.renderer.update(this);
    },

    destroy: function() {
        this.renderer.erase();
        CUORE.Bus.unsubscribe(this, this.getManagedEvents());
    },
    
    getLabelService: function() {
        return this.getService('LABELS');
    },

    execute: function(theService, theProcedure, params, asynchronous) {
        theService || (theService = this.service);
        theProcedure || (theProcedure = this.procedure);
        var serviceInstance = this.getService(theService);

        if (serviceInstance) {
            serviceInstance.execute(theProcedure, params, asynchronous);
        }
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

    getService: function(aService) {
        var theService = aService || this.service;
        return (document.page.getService(theService) || null);
    },

    getLabel: function() {
        if (!this.I18NKey || !this.getLabelService()) return;
        
        var params = { key: this.I18NKey };
        this.getLabelService().execute('getLabel', params, true);
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
        this.addHandler('LABELS_getLabel_EXECUTED_' + key, new CUORE.Handlers.setText());
        CUORE.Bus.subscribe(this, 'LABELS_getLabel_EXECUTED_' + key);
        this.getLabel();
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
