describe("Service", function() {
    var aService, xhr;

    beforeEach(function() {
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

    it("has a BaseURL defaulted to empty string", function() {
        expect(aService.getBaseURL()).toEqual('');
        var aBaseURL = "a Base URL";
        aService.setBaseURL(aBaseURL);
        expect(aService.getBaseURL()).toEqual(aBaseURL);
    });

    it("builds a unique eventname for every method", function() {
        var expectedName = 'ABSTRACT_aSpyProcedure_EXECUTED';
        aService.execute("aSpyProcedure", undefined);

        expect(aService.aSpyProcedure.mostRecentCall.args[1]).toEqual(expectedName);
    });

    it("calls the request with the default endpoint url", function(){
        var expectedUrl = "http://localhost/abstract/callee";
        aService.setBaseURL("http://localhost");

        aService.callee = function() {
            this._request('callee', null, null);
        };

        aService.execute('callee');

        expect(xhr.lastRequest().url).toEqual(expectedUrl);
    });

    describe("on emmiting", function() {
        
        beforeEach(function() {
            CUORE.Bus = CUORE.Mocks.bus('theBus');
        });

        it("call is  asynchronous ,only emmits when request has response ", function() {        
            aService.execute('requestProcedure');
            expect(CUORE.Bus.emit).not.toHaveBeenCalled();
            xhr.lastRequest().respond(200, {}, '{}');
            expect(CUORE.Bus.emit).toHaveBeenCalled();
        });

        it("parses the response as a Message", function() {
            var expectedMessage = new CUORE.Message('{"header":{},"query":{},"answer":{"anAnswerKey":"anAnswerValue"}}');

            var response = expectedMessage.asJson();

            aService.execute("requestProcedure");
            xhr.lastRequest().respond(200, {}, response);

            var theMessage = CUORE.Bus.emit.mostRecentCall.args[1];
            expect(theMessage.asJson()).toEqual(expectedMessage.asJson());
        });
    });
});