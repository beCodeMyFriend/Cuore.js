describe("NullService", function() {

    beforeEach(function() {

        this.addMatchers({
            toBeInstanceOf: CUORE.Matchers.toBeInstanceOf
        });

    });

    it("inherits Service", function() {
        var aService = new CUORE.Services.Null();
        expect(aService).toBeInstanceOf(CUORE.Service);
        expect(aService).toBeInstanceOf(CUORE.Services.Null);
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