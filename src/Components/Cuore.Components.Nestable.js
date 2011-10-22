CUORE.Components.Nestable = CUORE.Class(CUORE.Component, {
    
    init: function() {
        CUORE.Components.Nestable.super.init.call(this);
        
        this.hostedComponents = [];
    },

    host: function (anyComponent) {
        this.hostedComponents.push(anyComponent);
    },

    hosted: function (anyComponent) {
        return this.hostedComponents;
    },
    
    getManagedEvents: function () {
        var result = CUORE.Components.Nestable.super.getManagedEvents.call(this);
        
        for (var i = 0, len = this.hostedComponents.length; i < len; i++) {
            result.push.apply(result, this.hostedComponents[i].getManagedEvents());
        }
        return result;
    },
    
    eventDispatch: function (eventName, params) {
        CUORE.Components.Nestable.super.eventDispatch.call(this, eventName, params);
        
        for (var i = 0, len = this.hostedComponents.length; i < len; i++) {
            this.hostedComponents[i].eventDispatch(eventName, params);
        }
    },

    draw: function () {
        CUORE.Components.Nestable.super.draw.call(this);
        
        for (var i = 0, aComponent; aComponent = this.hostedComponents[i]; i++) {
            var containerId = this.renderer.innerDivName(this.getName());
            aComponent.setContainer(containerId);
            aComponent.draw();
        }
    },

    updateRender: function () {
        CUORE.Components.Nestable.super.updateRender.call(this);
        
        for (var i = 0, aComponent; aComponent = this.hostedComponents[i]; i++) {
            aComponent.updateRender();
        }
    },

    destroy: function () {
        for (var i = 0, len = this.hostedComponents.length; len < i; i++) {
            this.hostedComponents[i].destroy();
        }
        CUORE.Components.Nestable.super.destroy.call(this);
    },

    setName: function (name) {
        CUORE.Components.Nestable.super.setName.call(this, name);
        
        var ordinal = 1;
        for (var i = 0, len = this.hostedComponents.length; i < len; i++) {
            var component = this.hostedComponents[i];
            var componentName = this.getName() + this.SEPARATOR + component.getName() + this.SEPARATOR + ordinal;
            component.setName(componentName);
            ordinal++;
        }
    },
    
    enable: function () {
        CUORE.Components.Nestable.super.enable.call(this);
        for (var i = 0, len = this.hostedComponents.length; i < len; i++) {
            var component = this.hostedComponents[i];
            component.enable();
        }
    },

    disable: function () {
        CUORE.Components.Nestable.super.disable.call(this);
        for (var i = 0, len = this.hostedComponents.length; i < len; i++) {
            var component = this.hostedComponents[i];
            component.disable();
        }
    }    
    
});