describe("A Registry", function() {
    var aRegistry;

    beforeEach(function() {
        this.addMatchers({
            toHaveBeenCalledOnceWithTheComponent: CUORE.Matchers.toHaveBeenCalledOnceWithTheComponent
        });

        aRegistry = new CUORE.Registry();
    });

    it("by default has no components", function() {
        expect(aRegistry.size()).toEqual(0);
    });

    it("can register components ", function() {
        var aComponent = CUORE.Mocks.Component('aComponent');

        aRegistry.register(aComponent);
        expect(aRegistry.size()).toEqual(1);
        aRegistry.register(aComponent);
        expect(aRegistry.size()).toEqual(1);
    });

    it("retrieve a component by its name", function() {
        var aComponent = CUORE.Mocks.Component('aComponent');
        aComponent.setName('aComponent');

        aRegistry.register(aComponent);

        expect(aRegistry.filterByName('aComponent')).toEqual(aComponent);
    });


    describe("can iterate over its contents", function() {
        it("given it's empty, the callback won't be called", function() {
            var callback = jasmine.createSpy('callback');
            aRegistry.each(callback);

            expect(callback).not.toHaveBeenCalled();
        });

        describe("given it isn't empty", function() {
            var aComponent;
            beforeEach(function() {
                aComponent = CUORE.Mocks.Component('aComponent');
                aRegistry.register(aComponent);
            });

            it("the callback will be called once for each registered component", function() {
                var callback = jasmine.createSpy('callback');

                aRegistry.each(callback);

                expect(callback).toHaveBeenCalledOnceWithTheComponent(aComponent);
            });
        });
    });
});