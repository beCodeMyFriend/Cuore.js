CUORE.Page = CUORE.Class(null, {

    init: function(baseURL) {
        this.baseURL = baseURL || '';
        this.components = {};
        this.services = {};
        this.cleaners = [];
        document.page = this;
        this.addService(new CUORE.Services.Label());
        this.addService(new CUORE.Services.Button());
        this.setUp();
    },

    initializeServices: function() {},
    initializeComponents: function() {},

    setUp: function() {
        this.initializeServices();
        this.initializeComponents();
    },

    addService: function(service) {
        service.setBaseURL(this.getBaseURL());
        this.services[service.getName()] = service;
    },

    getService: function(name) {
        return (this.services[name] || new CUORE.Services.Null());
    },

    addComponent: function(component, container, replaceContent) {
        var name = this._generateUUID();
        this._subcribeComponentEvents(component);
        
        component.setName(name);
        this.components[component.getName()] = component;
        replaceContent && this.cleaners.push(component.getName());
        component.setContainer(container);
    },

    draw: function() {
        for (var component in this.components) {
            if (CUORE.Core.isOwnProperty(this.components, component)) {
                var currentComponent = this._getComponent(component);
                var componentName    = currentComponent.getName();

                if (this._componentIsInCleaners(this.cleaners, componentName)) {
                    currentComponent.getContainer().innerHTML = '';
                }
                currentComponent.draw(); 
            }
        }
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
    
    _getComponent: function(name) {
        return this.components[name] || null;
    },
    
    _generateUUID: function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },
    
    _componentIsInCleaners: function(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    }
});