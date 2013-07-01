describe("A Directory", function() {

    var aDirectory, defaultBaseUrl = "base URL";
  
    beforeEach(function() {
        this.addMatchers(CUORE.Matchers);
        aDirectory = new CUORE.Directory();
        aDirectory.setBaseURL(defaultBaseUrl);
    });

    it("has a Label service built-in", function() {
        var theService=aDirectory.getService('LABELS');
        expect(theService).toBeInstanceOf(CUORE.Services.Label);
        expect(theService.getBaseURL()).toEqual(defaultBaseUrl);
    });

    it("manages non remote services", function() {
        var theName='NON_REMOTE';
        var theService=CUORE.Mocks.service();
        theService.getName.andReturn(theName);
        aDirectory.add(theService);
        expect(aDirectory.getService(theName)).toBe(theService);
    });
   
    describe("with a service called 'FOO'", function() {
        var foo = "FOO";
        var fooService;

        beforeEach(function() {
            fooService = CUORE.Mocks.namedService(foo);
            aDirectory.add(fooService);
        });

        it(" can retrieve the configured service by name", function() {
            theService =aDirectory.getService(foo);
            expect(theService).toBe(fooService);
        });

        it("reconfigures all the services when baseURL is changed", function() {
            var anotherURL = "another base URL";
            var theService=CUORE.Mocks.service();
            theService.getName.andReturn('aName');
            aDirectory.add(theService);

            aDirectory.setBaseURL(anotherURL);

            expect(fooService.setBaseURL).toHaveBeenCalledWith(anotherURL);
            expect(aDirectory.getService('LABELS').getBaseURL()).toEqual(anotherURL);
        });

        it("manages multiple services", function() {
            var bar = "BAR";
            var barService =CUORE.Mocks.namedService(bar);

            aDirectory.add(barService);

            expect(fooService.getName).toHaveBeenCalled();
            expect(aDirectory.getService(foo)).toBe(fooService);
            expect(aDirectory.getService(bar)).toBe(barService);
        });

        it("has a convenience method to call a procedure in a managed service", function() {
            var procedureName = "aProcedure";
            var params = "parameters";

            aDirectory.execute(foo, procedureName, params);

            expect(fooService.execute).toHaveBeenCalledWith(procedureName, params);
        });

        it("uses a NullService when asked for a non managed service", function() {
            expect(aDirectory.getService('NOT EXISTS')).toBeInstanceOf(CUORE.Services.Null);
        });


        it("substitutes manged services properly", function() {
            var otherFoo = CUORE.Mocks.namedService(foo);
            aDirectory.add(otherFoo);
            expect(aDirectory.getService(foo)).toBe(otherFoo);
        });

    });
});