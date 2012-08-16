describe("ExecutorHandler", function () {

    beforeEach(function() {
            this.addMatchers({
                toBeInstanceOf: CUORE.Matchers.toBeInstanceOf
            });
    });

    it("inherits Handler", function () {

        var aHandler = new CUORE.Handlers.Executor();
        expect(aHandler).toBeInstanceOf(CUORE.Handlers.Executor);
        expect(aHandler).toBeInstanceOf(CUORE.Handler);
    });

    it("sets an owner function when it is initialized", function () {

        var aFunction = "testFunction";
        var aHandler = new CUORE.Handlers.Executor(aFunction);
        expect(aHandler.ownerFunction).toEqual(aFunction);
    });

    it("handle method calls a owner's method", function () {

        var aFunction = "testFunction";
        var aParams = "testParams";
        var aComponent = {};
        aComponent.testFunction = jasmine.createSpy("testFuncion");
        
        var aHandler = new CUORE.Handlers.Executor(aFunction);
        aHandler.setOwner(aComponent);
        aHandler.handle(aParams);
        expect(aComponent.testFunction).toHaveBeenCalledWith(aParams);
    });
});