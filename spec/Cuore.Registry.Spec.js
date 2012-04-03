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

            it("even if an exception is thrown from the callback, it will be called once for each registered component", function() {
                var otherComponent = CUORE.Mocks.Component('otherComponent');
                aRegistry.register(otherComponent)

                var callback = jasmine.createSpy('crappy callback').andThrow("Error!");

                aRegistry.each(callback);

                expect(callback.callCount).toEqual(2);
            });
        });
    });
});