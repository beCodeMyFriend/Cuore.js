describe("PrintHandler", function () {
	
    beforeEach(function() {
            this.addMatchers({
                toBeInstanceOf: CUORE.Matchers.toBeInstanceOf
            });
    });


    it("inherits Handlet", function () {
        var theHandler = new CUORE.Handlers.Print();
        expect(theHandler).toBeInstanceOf(CUORE.Handlers.Print);
        expect(theHandler).toBeInstanceOf(CUORE.Handler);
    });

    it("executes window.print", function () {        
        window.print = jasmine.createSpy("print");
        var theHandler = new CUORE.Handlers.Print();
        theHandler.handle();
        expect(window.print).toHaveBeenCalled();
    });
});