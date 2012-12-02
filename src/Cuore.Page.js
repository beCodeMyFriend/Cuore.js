CUORE.Page = CUORE.Class(null, {

    init: function() {
        this.components = new CUORE.Registry();
        this.services = new CUORE.Directory();
        this.state = new CUORE.State();
        this.setUp();
    },

    setUp: function() {
        this.initializeServices();
        this.initializeComponents();
    },

    initializeServices: function() {},
    initializeComponents: function() {},

    addComponent: function(component, container, behaviour) {
        component.setDirectory(this.services);

        if(behaviour) component.behave(behaviour);
        this.components.register(component);

        component.setContainer(container);
        component.onEnvironmentUp();
    },

    draw: function() {
        this.components.each(function(component) {
            component.draw();
        });
    },

    getComponentWithDOMId: function(id) {
        return this.components.filterByName(id);
    },

    addService: function(service) {
        this.services.add(service);
    },

    getService: function(name) {
        return this.services.getService(name);
    },

    save: function(key, value) {
        this.state.save(key, value);
    },

    retrieve: function(key) {
        return this.state.retrieve(key);
    },

    setRegistry: function(registry) {
        this.components = registry;
    },

    setDirectory: function(directory) {
        this.services = directory;
    }
});