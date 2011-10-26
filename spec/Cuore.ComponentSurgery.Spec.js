describe("A component", function() {
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

    it("can execute a service through the directory", function() {
        var aDirectory = CUORE.Mocks.Directory();
        aComponent.setDirectory(aDirectory);

        var theServiceName = "serviceName";
        var theProcedureName = "procedureName";
        var params = "these are the mock params";

        aComponent.execute(theServiceName, theProcedureName, params, true);

        expect(aDirectory.execute).toHaveBeenCalledWith(theServiceName, theProcedureName, params, true);
    });
});