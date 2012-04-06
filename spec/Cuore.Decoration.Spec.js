describe("Decoration", function() {

    beforeEach(function() {
        this.addMatchers({
            toBeInstanceOf: CUORE.Matchers.toBeInstanceOf,
            toBeFunction: CUORE.Matchers.toBeFunction
        });
    });

    it("is a Decoration", function() {
        var aDecoration = new CUORE.Decoration();
        expect(aDecoration).toBeInstanceOf(CUORE.Decoration);
    });

    it("has a postPaint function ", function() {
        var aDecoration = new CUORE.Decoration();
        expect(aDecoration.postPaint).toBeFunction();
        expect(aDecoration.postPaint.length).toEqual(1);
    });

});