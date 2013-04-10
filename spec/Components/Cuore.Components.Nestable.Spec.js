describe("NestableComponent", function() {

    it("is a Component", function() {
        var aComponent = new CUORE.Components.Nestable();
        expect(aComponent instanceof CUORE.Component).toBeTruthy();
    });

    it("can host any Component", function() {
        var anyComponent = new CUORE.Component();
        var aComponent = new CUORE.Components.Nestable();

        aComponent.host(anyComponent);

        expect(aComponent.hosted()).toContain(anyComponent);
    });

    it("when a component is hosted, is configured with the directory", function() {
        var anyComponent = CUORE.Mocks.Component('any component');
        var aDirectory = CUORE.Mocks.Directory();
        var aComponent = new CUORE.Components.Nestable();
        aComponent.setDirectory(aDirectory);

        aComponent.host(anyComponent);

        expect(anyComponent.setDirectory).toHaveBeenCalledWith(aDirectory);
    });


    it("when the directory is changed, the hosted components are reconfigured with the new one", function() {
        var aDirectory = CUORE.Mocks.Directory();
        var anyComponent = CUORE.Mocks.Component('any component');
        var aComponent = new CUORE.Components.Nestable();
        aComponent.host(anyComponent);

        aComponent.setDirectory(aDirectory);

        expect(anyComponent.setDirectory).toHaveBeenCalledWith(aDirectory);
    });

    it("knows events managed by nested Components", function() {
        var anyComponent = new CUORE.Component();
        var aHandler = {};
        aHandler.setOwner = function() {};
        anyComponent.addHandler("anEvent", aHandler);
        anyComponent.addHandler("sameEvent", aHandler);

        var aComponent = new CUORE.Components.Nestable();
        aComponent.addHandler("anotherEvent", aHandler);
        aComponent.addHandler("sameEvent", aHandler);

        aComponent.host(anyComponent);

        expect(aComponent.getManagedEvents()).toContain("anEvent");
        expect(aComponent.getManagedEvents()).toContain("anotherEvent");
        expect(aComponent.getManagedEvents()).toContain("sameEvent");
    });

    it("dispatch events to nestedComponents", function() {
        var anyComponent = new CUORE.Component();

        spyOn(anyComponent, "eventDispatch");

        var aComponent = new CUORE.Components.Nestable();

        aComponent.host(anyComponent);
        aComponent.eventDispatch("anEvent", undefined);

        expect(anyComponent.eventDispatch).toHaveBeenCalledWith("anEvent", undefined);
    });

    it("draws nested components inside nesting components", function() {
        var anyComponent = new CUORE.Component();
        spyOn(anyComponent, "draw");
        var aComponent = new CUORE.Components.Nestable();

        aComponent.host(anyComponent);

        aComponent.draw();

        expect(anyComponent.draw).toHaveBeenCalled();
    });

    it("draws nested components inside parent panel", function() {
        var anyComponent = new CUORE.Component();
        anyComponent.setContainer = jasmine.createSpy('setContainer');
        anyComponent.draw = jasmine.createSpy('draw');

        var aComponent = new CUORE.Components.Nestable();
        aComponent.renderer.innerDivName = jasmine.createSpy('innerDivName').andReturn('divName');
        aComponent.host(anyComponent);

        aComponent.draw();

        expect(anyComponent.setContainer).toHaveBeenCalledWith('divName');
        expect(anyComponent.draw).toHaveBeenCalled();
    });

    it("updates nested components inside parent component", function() {
        var anyComponent = new CUORE.Component();
        spyOn(anyComponent, 'updateRender');
        var aComponent = new CUORE.Components.Nestable();

        aComponent.host(anyComponent);

        aComponent.updateRender();

        expect(anyComponent.updateRender).toHaveBeenCalled();
    });

    it("assigns different identifiers to nested components", function() {
        var aNestedComponent = new CUORE.Component();
        var anotherNestedComponent = new CUORE.Component();
        var aComponent = new CUORE.Components.Nestable();
        aComponent.host(aNestedComponent);
        aComponent.host(anotherNestedComponent);

        aComponent.setName("chauirules")
        var anyId = aNestedComponent.getName();
        var anotherNestedId = anotherNestedComponent.getName();

        expect(anyId).not.toEqual(anotherNestedId);
    });

    it("destroy nested components when destroy component", function() {
        var anyComponent = new CUORE.Component();
        var aComponent = new CUORE.Components.Nestable();
        aComponent.host(anyComponent);

        spyOn(anyComponent, 'destroy');
        CUORE.Components.Nestable.parent.destroy = jasmine.createSpy('destroy nestable');

        aComponent.destroy();

        expect(anyComponent.destroy).toHaveBeenCalled();
        expect(CUORE.Components.Nestable.parent.destroy).toHaveBeenCalled();
    });

    it("transmits enable/disable behaviour to nestedComponents", function() {
        var anyComponent = new CUORE.Component();

        spyOn(anyComponent, "enable");
        spyOn(anyComponent, "disable");

        var aComponent = new CUORE.Components.Nestable();

        aComponent.host(anyComponent);

        aComponent.disable();
        expect(anyComponent.disable).toHaveBeenCalled();

        aComponent.enable();
        expect(anyComponent.enable).toHaveBeenCalled();
    });
});