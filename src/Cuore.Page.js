CUORE.Page = CUORE.Class(null, {

    init: function(baseURL) {
        this.baseURL = baseURL || '';
        this.components = new CUORE.Registry();
        this.services = new CUORE.Directory();
        document.page = this;
        this.setUp();
    },

    setRegistry:function(registry) {
        this.components = registry;
    },

    setDirectory:function(directory) {
        this.services = directory;
    },

    initializeServices: function() {},
    initializeComponents: function() {},

    setUp: function() {
        this.initializeServices();
        this.initializeComponents();
    },

    addService: function(service) {
        service.setBaseURL(this.getBaseURL());
        this.services.add(service);
    },

    getService: function(name) {
        return this.services.getService(name);
    },

    addComponent: function(component, container, replaceContent) {
        component.setName(this._generateUUID());
        if(!replaceContent)
            component.dontReplace();

        this._subcribeComponentEvents(component);

        this.components.register(component);

        component.setContainer(container);
    },

    draw: function() {
        this.components.each(function(component) {
            component.draw();
        });
    },

    getBaseURL: function() {
        return this.baseURL;
    },
    
    _subcribeComponentEvents: function(component) {
        var events = component.getManagedEvents();
        var bus = this._getBus();

        for (var i = 0, len = events.length; i < len; i++) {
            bus.subscribe(component, events[i]);
        }
    },
    
    _getBus: function() {
        return CUORE.Bus;
    },
    
    _generateUUID: function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
});