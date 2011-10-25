describe("Component", function() {

    
    it("has a replace behaviour by default", function() {
        var aComponent=new CUORE.Component();
        expect(aComponent.doYouReplace()).toBeTruthy();
    });

    it("can cancel its replace behaviour", function() {
        var aComponent=new CUORE.Component();
        aComponent.dontReplace();
        expect(aComponent.doYouReplace()).toBeFalsy();
    });
    
});