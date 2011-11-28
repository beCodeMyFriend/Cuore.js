CUORE.Page = CUORE.Class(null, {

    init: function(baseURL) {
        this.baseURL = baseURL;
        this.components = new CUORE.Registry();
        this.services = new CUORE.Directory();
        this.services.setBaseURL(baseURL);
        this.state = new CUORE.State();
        this.setUp();
    },

    setRegistry:function(registry) {
        this.components = registry;
    },

    _getBaseURL:function() {
      return this.baseURL;
    },
  
    setDirectory:function(directory) {
        this.services = directory;
        this.services.setBaseURL(this._getBaseURL());
    },

    initializeServices: function() {},
    initializeComponents: function() {},

    setUp: function() {
        this.initializeServices();
        this.initializeComponents();
    },

    addService: function(service) {
        this.services.add(service);
    },

    getService: function(name) {
        return this.services.getService(name);
    },

    addComponent: function(component, container, replaceContent) {
        component.setName(this._generateUUID());
        component.setDirectory(this.services);
      
        if(!replaceContent) component.dontReplace();

        this._subcribeComponentEvents(component);
        this.components.register(component);

        component.setContainer(container);
    },

    draw: function() {
        this.components.each(function(component) {
            component.draw();
        });
    },
    
    save: function(key,value) {
        this.state.save(key,value);    
    },
    
    
    retrieve: function(key) {
        return this.state.retrieve(key);
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