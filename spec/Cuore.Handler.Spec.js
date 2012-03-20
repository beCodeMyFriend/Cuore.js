describe("Handler", function() {

    it("has an owner", function() {
        var aHandler = new CUORE.Handler();
        var anObject = {};

        aHandler.setOwner(anObject);

        expect(aHandler.getOwner()).toEqual(anObject);
    });

});