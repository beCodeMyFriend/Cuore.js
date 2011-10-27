describe("A HandlersDirectory", function() {

    var aHandlersDirectory, aHandler;

    beforeEach(function() {
        aHandlersDirectory = new CUORE.HandlersDirectory();
        aHandler = CUORE.Mocks.mock("aHandler", []);

        aHandlersDirectory.add(aHandler);
    });

    describe("with a handler added", function() {
        it("should list added handlers", function () {
            var anotherHandler = CUORE.Mocks.mock("anotherHandler", []);
            aHandlersDirectory.add(anotherHandler);

            expect(aHandlersDirectory.list()).toContain(aHandler);
            expect(aHandlersDirectory.list()).toContain(anotherHandler);
        });

        it("can't add the same handler twice", function() {
            aHandlersDirectory.add(aHandler);

            expect(aHandlersDirectory.list().length).toEqual(1);
        });
    });

});