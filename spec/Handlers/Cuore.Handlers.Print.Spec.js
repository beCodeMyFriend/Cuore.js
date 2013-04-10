describe("PrintHandler", function () {
	
    it("inherits Handlet", function () {
        var theHandler = new CUORE.Handlers.Print();

        expect(theHandler instanceof CUORE.Handlers.Print).toBeTruthy();
        expect(theHandler instanceof CUORE.Handler).toBeTruthy();
    });

    it("executes window.print", function () {
        var originalPrint = window.print;

        var printCalled = false;
        window.print = function () {
            printCalled = true;
        };

        var theHandler = new CUORE.Handlers.Print();

        theHandler.handle();

        expect(printCalled).toBeTruthy();

        window.print = originalPrint;
    });
});