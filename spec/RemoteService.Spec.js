describe("RemoteService", function() {
    var aRemoteService, xhr;

    beforeEach(function() {
        aRemoteService = new CUORE.RemoteService();

        aRemoteService.requestProcedure = function(params, eventname) {
            this._request(undefined, undefined, undefined);
        }
        
        this.addMatchers(CUORE.Matchers);
        
        xhr = new CUORE.Helpers.Xhr();
    });

    afterEach(function() {
        xhr.restore();
    });

    it("has a BaseURL defaulted to empty string", function() {
        expect(aRemoteService.getBaseURL()).toEqual('');
        var aBaseURL = "a Base URL";
        aRemoteService.setBaseURL(aBaseURL);
        expect(aRemoteService.getBaseURL()).toEqual(aBaseURL);
    });

    it("calls the request with the default endpoint url", function(){
        var expectedUrl = "http://localhost/abstract/callee";
        aRemoteService.setBaseURL("http://localhost");

        aRemoteService.callee = function() {
            this._request('callee', null, null);
        };

        aRemoteService.execute('callee');

        expect(xhr.lastRequest().url).toEqual(expectedUrl);
    });

    describe("on emmiting", function() {
        
        beforeEach(function() {
            CUORE.Bus = CUORE.Mocks.bus('theBus');
        });

        it("call is  asynchronous ,only emmits when request has response ", function() {        
            aRemoteService.execute('requestProcedure');
            expect(CUORE.Bus.emit).not.toHaveBeenCalled();
            xhr.lastRequest().respond(200, {}, '{}');
            expect(CUORE.Bus.emit).toHaveBeenCalled();
        });

        it("parses the response as a Message", function() {
            var expectedMessage = new CUORE.Message('{"header":{},"query":{},"answer":{"anAnswerKey":"anAnswerValue"}}');

            var response = expectedMessage.asJson();

            aRemoteService.execute("requestProcedure");
            xhr.lastRequest().respond(200, {}, response);

            var theMessage = CUORE.Bus.emit.mostRecentCall.args[1];
            expect(theMessage.asJson()).toEqual(expectedMessage.asJson());
        });
    });
});