describe("A Directory", function() {

    var aDirectory, defaultBaseUrl = "base URL";
    var mockService = function(name) {
            var service = CUORE.Mocks.Service();
            service.getName.andReturn(name);
            return service;
        };

    beforeEach(function() {
        this.addMatchers({
            toBeInstanceOf: CUORE.Matchers.toBeInstanceOf
        });

        aDirectory = new CUORE.Directory();
        aDirectory.setBaseURL(defaultBaseUrl);
    });

    it("has a Label service built-in", function() {
        expect(aDirectory.getService('LABELS')).toBeInstanceOf(CUORE.Services.Label);
    });

    it("has a Label service built-in with a proper base url", function() {
        expect(aDirectory.getService('LABELS').getBaseURL()).toEqual(defaultBaseUrl);
    });

    it("has a Button service built-in", function() {
        expect(aDirectory.getService('BUTTON')).toBeInstanceOf(CUORE.Services.Button);
    });

    it("has a Button service built-in with a proper base url", function() {
        expect(aDirectory.getService('BUTTON').getBaseURL()).toEqual(defaultBaseUrl);
    });

    describe("with a service called 'TAL'", function() {
        var tal = "TAL";
        var talService;

        beforeEach(function() {
            talService = mockService(tal);
            aDirectory.add(talService);
        });

        it("the service 'TAL' will be asked for its name", function() {
            expect(talService.getName).toHaveBeenCalled();
        });

        it("the service 'TAL' will be configured with a baseURL", function() {
            expect(talService.setBaseURL).toHaveBeenCalledWith(defaultBaseUrl);
        });

        it(" getService('TAL') will return the 'TAL' service", function() {
            expect(aDirectory.getService(tal)).toBe(talService);
        });

        it("when baseURL is changed, all the services are reconfigured", function() {
            var anotherURL = "another base URL";

            aDirectory.setBaseURL(anotherURL);

            expect(talService.setBaseURL).toHaveBeenCalledWith(anotherURL);
            expect(aDirectory.getService('BUTTON').getBaseURL()).toEqual(anotherURL);
            expect(aDirectory.getService('LABELS').getBaseURL()).toEqual(anotherURL);
        });

        it("when service 'PASCUAL' is added, then directory  contains 'TAL' and 'PASCUAL'", function() {
            var pascual = "PASCUAL";
            var pascualService = mockService(pascual);

            aDirectory.add(pascualService);

            expect(talService.getName).toHaveBeenCalled();
            expect(aDirectory.getService(tal)).toBe(talService);
            expect(aDirectory.getService(pascual)).toBe(pascualService);
        });

        it("when execute is called for 'TAL' service, the execute method of the 'TAL' service will be called", function() {
            var procedureName = "aProcedure";
            var params = "parameters";

            aDirectory.execute(tal, procedureName, params);

            expect(talService.execute).toHaveBeenCalledWith(procedureName, params);
        });

        it("when execute is called with a non existing service name, it will do nothing", function() {
            var procedureName = "CUAL";
            var params = "parameters";

            aDirectory.execute("NOT EXISTS", procedureName, params);

            expect(talService.execute).not.toHaveBeenCalled();
        });


        it("when another service 'TAL' is added replaces old service", function() {
            var otherTal = mockService(tal);

            aDirectory.add(otherTal);

            expect(aDirectory.getService(tal)).toBe(otherTal);
        });


        it(" getService('NOT EXISTS') will return an instance of NullService", function() {
            expect(aDirectory.getService('NOT EXISTS')).toBeInstanceOf(CUORE.Services.Null);
        });
    });
});