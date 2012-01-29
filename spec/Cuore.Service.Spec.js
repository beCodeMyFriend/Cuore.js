describe("Service", function() {
    var xhr;

    beforeEach(function() {
        xhr = sinon.useFakeXMLHttpRequest();
        var requests = [];

        xhr.onCreate = function(xhr) {
            requests.push(xhr);
        };

        CUORE.Core.createXHR = function() {
            return xhr;
        };
    });

    afterEach(function() {
        xhr.restore();
    });

    it("calls procedure asynchronously but bus cannot emit yet when service is executed asynchronously", function() {
        var aService = new CUORE.Service();
        aService = addTestProcedure(aService);
        var bus = createDummyBus();
        aService.getBus = function() {
            return bus;
        };

        var procedureName = "testProcedure";
        spyOn(aService, "testProcedure");
        var params = {
            "testParam1": true,
            "testParam2": true
        };

        aService.execute(procedureName, params, true);

        expect(aService.testProcedure.mostRecentCall.args[0]).toEqual(params);
        expect(aService.getBus().broadcastEvent).toBeUndefined();
    });

    it("has a BaseURL defaulted to empty string", function() {
        var aService = new CUORE.Service();
        expect(aService.getBaseURL()).toEqual('');

        var aBaseURL = "a Base URL";
        aService.setBaseURL(aBaseURL);
        expect(aService.getBaseURL()).toEqual(aBaseURL);
    });

    it("executes a procedure asynchronously and bus emits the event when request completes", function() {
        var aService = new CUORE.Service();
        var procedureName = "testProcedure";

        aService.testProcedure = function(params, eventName) {
            this.request("aUrl", params, eventName);
        };

        var bus = createDummyBus();
        aService.getBus = function() {
            return bus;
        };

        var executedEvent = aService.getEventNameForExecution(procedureName);
        aService.getBus().emit = function(event, params) {
            this.broadcastEvent = event;
            expect(this.broadcastEvent).toEqual(executedEvent);
        };

        aService.execute(procedureName, {}, true);
    });

    it("emits a message with response encoded as a message", function() {
        var aService = new CUORE.Service();

        var mockedBus = {};
        mockedBus.emit = function(eventName, response) {};
        var expectedMessage = new CUORE.Message('{"header":{},"query":{},"answer":{"anAnswerKey":"anAnswerValue"}}');

        var response = expectedMessage.asJson();


        spyOn(mockedBus, "emit");
        spyOn(aService, "getBus").andReturn(mockedBus);

        aService.emit("eventname", response);

        var theMessage = mockedBus.emit.mostRecentCall.args[1];

        expect(theMessage.asJson()).toEqual(expectedMessage.asJson());
    });

    it("builds a unique name for every event sent", function() {
        var aService = new CUORE.Service();

        var procedureName = "procedureTest";
        var SEPARATOR = "_";
        var expectedName = aService.getName() + SEPARATOR + procedureName + SEPARATOR + aService.executionPrefix;

        expect(aService.getEventNameForExecution(procedureName)).toEqual(expectedName);
    });

    var addTestProcedure = function(aService) {
        aService.testProcedureExecuted = false;
        aService.testProcedureParams = null;

        aService.testProcedure = function(procedureParams) {};
        return aService;
    };

    var createDummyBus = function() {
        var aBus = {};
        aBus.broadcastEvent = undefined;

        aBus.emit = function(event, params) {
            this.broadcastEvent = event;
        };

        return aBus;
    };
});