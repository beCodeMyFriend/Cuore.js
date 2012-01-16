CUORE.Components.Nestable = CUORE.Class(CUORE.Component, {

    init: function() {
        CUORE.Components.Nestable.parent.init.call(this);

        this.hostedComponents = [];
    },

    host: function (anyComponent) {
        anyComponent.setDirectory(this.services);
        this.hostedComponents.push(anyComponent);
    },

    setDirectory: function(aDirectory) {
        CUORE.Components.Nestable.parent.setDirectory.call(this, aDirectory);

        for (var i = 0, len = this.hostedComponents.length; i < len; i++)
            this.hostedComponents[i].setDirectory(aDirectory);
    },

    hosted: function (anyComponent) {
        return this.hostedComponents;
    },

    getManagedEvents: function () {
        var result = CUORE.Components.Nestable.parent.getManagedEvents.call(this);

        for (var i = 0, len = this.hostedComponents.length; i < len; i++) {
            result.push.apply(result, this.hostedComponents[i].getManagedEvents());
        }
        return result;
    },

    eventDispatch: function (eventName, params) {
        CUORE.Components.Nestable.parent.eventDispatch.call(this, eventName, params);

        for (var i = 0, len = this.hostedComponents.length; i < len; i++) {
            this.hostedComponents[i].eventDispatch(eventName, params);
        }
    },

    draw: function () {
        CUORE.Components.Nestable.parent.draw.call(this);

        for (var i = 0, aComponent; aComponent = this.hostedComponents[i]; i++) {
            var containerId = this.renderer.innerDivName(this.getName());
            aComponent.setContainer(containerId);
            aComponent.draw();
        }
    },

    updateRender: function () {
        CUORE.Components.Nestable.parent.updateRender.call(this);

        for (var i = 0, aComponent; aComponent = this.hostedComponents[i]; i++) {
            aComponent.updateRender();
        }
    },

    destroy: function () {
        for (var i = 0, len = this.hostedComponents.length; i < len ; i++) {
            this.hostedComponents[i].destroy();
        }
        CUORE.Components.Nestable.parent.destroy.call(this);
    },

    setName: function (name) {
        CUORE.Components.Nestable.parent.setName.call(this, name);

        var ordinal = 1;
        for (var i = 0, len = this.hostedComponents.length; i < len; i++) {
            var component = this.hostedComponents[i];
            var componentName = this.getName() + this.SEPARATOR + component.getName() + this.SEPARATOR + ordinal;
            component.setName(componentName);
            ordinal++;
        }
    },

    enable: function () {
        CUORE.Components.Nestable.parent.enable.call(this);

        for (var i = 0, len = this.hostedComponents.length; i < len; i++) {
            var component = this.hostedComponents[i];
            component.enable();
        }
    },

    disable: function () {
        CUORE.Components.Nestable.parent.disable.call(this);

        for (var i = 0, len = this.hostedComponents.length; i < len; i++) {
            var component = this.hostedComponents[i];
            component.disable();
        }
    }
});
