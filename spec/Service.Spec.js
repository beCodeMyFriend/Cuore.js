describe("Service", function() {
    var aService, requests, xhr;

    beforeEach(function() {
        aService = new CUORE.Service();

        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];

        xhr.onCreate = function(xhr) {
            requests.push(xhr);
        };
    });

    afterEach(function() {
        xhr.restore();
    });

    it(" calls the service method on 'execute'", function() {
        var procedureName = "aProcedure";
        var params = {
            "testParam1": true,
            "testParam2": true
        };
        aService.aProcedure = jasmine.createSpy(procedureName);
        
        aService.execute(procedureName, params);
        
        expect(aService.aProcedure).toHaveBeenCalledWith(params, 'ABSTRACT_aProcedure_EXECUTED');
    });

    it("call is  asynchronous ,only emmits when request has response ", function() {
        aService.emit= jasmine.createSpy('emit');
        aService.requestProcedure = function(params, eventname) {
            this.request(undefined, undefined, undefined);
        }

        aService.execute('requestProcedure');

        expect(aService.emit).not.toHaveBeenCalled();
        lastRequest().respond(200, {}, '{}');
        expect(aService.emit).toHaveBeenCalled();
    });

    it("has a BaseURL defaulted to empty string", function() {
        expect(aService.getBaseURL()).toEqual('');

        var aBaseURL = "a Base URL";
        aService.setBaseURL(aBaseURL);
        expect(aService.getBaseURL()).toEqual(aBaseURL);
    });


    it("parses the response as a Message and emits through the Bus", function() {
        var expectedMessage = new CUORE.Message('{"header":{},"query":{},"answer":{"anAnswerKey":"anAnswerValue"}}');
        var response = expectedMessage.asJson();

        CUORE.Bus = CUORE.Mocks.bus('theBus');
        aService.emit("eventname", response);

        var theMessage = CUORE.Bus.emit.mostRecentCall.args[1];

        expect(theMessage.asJson()).toEqual(expectedMessage.asJson());
    });

    it("builds a unique eventname for every method", function() {
        var aService = new CUORE.Service();

        var procedureName = "procedureTest";
        var expectedName = 'ABSTRACT_procedureTest_EXECUTED';

        expect(aService.getEventNameForExecution(procedureName)).toEqual(expectedName);
    });

    var lastRequest = function() {
        var last = requests[requests.length - 1];
        return last;
    };

});