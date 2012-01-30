CUORE.Component = CUORE.Class(null, {

    init: function() {
        this.setHandlerSet(new CUORE.HandlerSet());
        this.name = 'aComponent';
        this.service = 'NULL';
        this.procedure = 'nullProcedure';
        this.I18NKey = null;
        this.SEPARATOR = '_';
        this.text = '';
        this.renderer = new CUORE.Renderer();
        this.enabled = true;
        this.behaviour = CUORE.Behaviours.APPEND;
    },

    setHandlerSet: function(handlerSet) {
        this.handlerSet = handlerSet;
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
        if (this.doYouHijack()) this.setName(container);
        this.renderer.setContainer(container);
    },

    getContainer: function() {
        return this.renderer.getContainer();
    },

    getUniqueID: function() {
        var id = this.renderer.innerDivName(this.name);
        if (this.doYouHijack()) id = this.name;
        return id;
    },

    getManagedEvents: function() {
        return this.handlerSet.getManagedEvents();
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

    requestLabelText: function(key) {
        if (key && this.services) {
            this.services.execute("LABELS", 'getLabel', {
                key: key
            }, true);
        }
    },

    _requestLabelText: function() {
        if (!this.I18NKey) return;

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
    },

    addDecoration: function(decoration) {
        if (decoration instanceof CUORE.Decoration) {
            this.renderer.addDecoration(decoration);
        }
    },

    onEnvironmentUp: function() {}

});