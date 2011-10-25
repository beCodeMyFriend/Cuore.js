describe("Component", function() {
    var aComponent;
    beforeEach(function() {
        aComponent = new CUORE.Component();
    });
    
    it("has a replace behaviour by default", function() {
        expect(aComponent.doYouReplace()).toBeTruthy();
    });

    it("can cancel its replace behaviour", function() {
        aComponent.dontReplace();
      
        expect(aComponent.doYouReplace()).toBeFalsy();
    });
});