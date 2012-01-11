describe("Decoration", function() {
    
    it("is a Decoration", function() {
        var aDecoration=new CUORE.Decoration();
        expect(aDecoration instanceof CUORE.Decoration).toBeTruthy();
    });

    it("has a postPaint function ", function() {
        var aDecoration=new CUORE.Decoration();
        expect(typeof aDecoration.postPaint === 'function').toBeTruthy();
        expect (aDecoration.postPaint.length).toEqual(1);
    });

});