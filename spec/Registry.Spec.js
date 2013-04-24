describe("A Registry", function() {
    var aRegistry;

    beforeEach(function() {
        this.addMatchers(CUORE.Matchers);
        aRegistry = new CUORE.Registry();
    });

    it("by default has no components", function() {
        expect(aRegistry.size()).toEqual(0);
    });

    it("can register components ", function() {
        aRegistry.register(CUORE.Mocks.component('aComponent'));
        aRegistry.register(CUORE.Mocks.component('anotherComponent'));
        expect(aRegistry.size()).toEqual(2);
    });

    it("only registers a component once ", function() {
        var aComponent=CUORE.Mocks.component('aComponent');
        aRegistry.register(aComponent);
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
                aComponent = CUORE.Mocks.component('aComponent');
                aRegistry.register(aComponent);
            });

            it("the callback will be called once for each registered component", function() {
                var callback = jasmine.createSpy('callback');
                var anotherComponent=CUORE.Mocks.component('anotherComponent');
                aRegistry.register(anotherComponent);
                aRegistry.each(callback);
                expect(callback).toHaveBeenCalledWith(aComponent);
                expect(callback).toHaveBeenCalledWith(anotherComponent);
                expect(callback.calls.length).toEqual(2);
            });
        });
    });
});