describe("NullService", function() {

    it("inherits Service", function() {
        var aService = new CUORE.Services.Null();
        expect(aService instanceof CUORE.Service).toBeTruthy();
        expect(aService instanceof CUORE.Services.Null).toBeTruthy();
    });

    it("does nothing when executes a procedure", function() {
        var aService = new CUORE.Services.Null();

        spyOn(CUORE.Bus, "emit");
        var procedureName = "testProcedure";
        var params = {
            "testParam1": true,
            "testParam2": true
        };

        aService.execute(procedureName, params);
        expect(CUORE.Bus.emit).not.toHaveBeenCalled();
    });
});