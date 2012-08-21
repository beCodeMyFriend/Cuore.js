describe("ButtonService", function() {

    beforeEach(function() {

        this.addMatchers({
            toBeInstanceOf: CUORE.Matchers.toBeInstanceOf
        });

    });

    it("inherits Service", function() {
        var aButtonService = new CUORE.Services.Button();

        expect(aButtonService).toBeInstanceOf(CUORE.Service);
        expect(aButtonService).toBeInstanceOf(CUORE.Services.Button);

    });

    it("emits to bus with correct eventname and buttonname property is added to message Query when it is executed", function() {
        var testingProcedure = "testingProcedure";
        var thePrefix = "CLICKED";

        var aButtonService = new CUORE.Services.Button();

        spyOn(CUORE.Bus, "emit");

        var testParams = {
            'key': 'value'
        };

        var eventNameExpected = aButtonService.name + aButtonService.SEPARATOR + testingProcedure + aButtonService.SEPARATOR + thePrefix;

        aButtonService.execute(testingProcedure, testParams);

        var expectedMessage = new CUORE.Message();
        expectedMessage.putMapOnQuery(testParams);
        expectedMessage.putOnQuery("buttonName", testingProcedure);
        expect(CUORE.Bus.emit).toHaveBeenCalledWith(eventNameExpected, expectedMessage);
    });
});