describe("Service", function() {
    var aService, xhr;

    beforeEach(function() {
        this.addMatchers(CUORE.Matchers);
        aService = new CUORE.Service();
        aService.aSpyProcedure = jasmine.createSpy("aSpyProcedure");

        aService.requestProcedure = function(params, eventname) {
            this._request(undefined, undefined, undefined);
        }
        xhr = new CUORE.Helpers.Xhr();
    });

    afterEach(function() {
        xhr.restore();
    });

    it("calls the service method on 'execute'", function() {
        var procedureName = "aSpyProcedure";
        var params = {
            "testParam1": true,
            "testParam2": true
        };

        aService.execute(procedureName, params);

        expect(aService.aSpyProcedure).toHaveBeenCalledWith(params, 'ABSTRACT_aSpyProcedure_EXECUTED');
    });

    it("builds a unique eventname for every method", function() {
        var expectedName = 'ABSTRACT_aSpyProcedure_EXECUTED';
        aService.execute("aSpyProcedure", undefined);

        expect(aService.aSpyProcedure.mostRecentCall.args[1]).toEqual(expectedName);
    });

    it("has builtin cache capabilities",function() {
        expect(aService.cache).toBeInstanceOf(CUORE.Cache);
    });
});