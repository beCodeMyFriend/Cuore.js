describe("Service", function() {
    var xhr;

    beforeEach(function(){
        xhr = sinon.useFakeXMLHttpRequest();
        var requests = [];
        
        xhr.onCreate = function (xhr) {
            requests.push(xhr);
        };
      
        CUORE.Core.createXHR = function(){
            return xhr;
        };
    });

    afterEach(function(){
        xhr.restore();
    });

    it("calls procedure and bus emits the event when service is executed", function() {
        var aService = new CUORE.Service();
        aService = addTestProcedure(aService);
        var bus = createDummyBus();
        aService.getBus = function() {
            return bus;
        };

        var procedureName = "testProcedure";
        spyOn(aService, "testProcedure");
        var params = {
            "testParam1": "true",
            "testParam2": "true"
        };

        aService.execute(procedureName, params);

        expect(aService.testProcedure.mostRecentCall.args[0]).toEqual(params);
        expect(aService.getBus().broadcastEvent).toEqual(aService.getEventNameForExecution(procedureName));
    });

    it("calls procedure and bus emits the event when Service executes a procedure synchronously", function() {
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

        aService.execute(procedureName, params, false);

        expect(aService.testProcedure.mostRecentCall.args[0]).toEqual(params);
        expect(aService.getBus().broadcastEvent).toEqual(aService.getEventNameForExecution(procedureName));
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

    it("stores the last data sent when executed ", function() {
        var aService = new CUORE.Service();
        var asyncService = new CUORE.Service();

        expect(aService.getLastDataSent()).toBeNull();
        expect(asyncService.getLastDataSent()).toBeNull();

        aService = addTestProcedure(aService);
        asyncService = addTestProcedure(asyncService);

        var bus = createDummyBus();

        aService.getBus = function() {
            return bus;
        };
        asyncService.getBus = function() {
            return bus;
        };

        var procedureName = "testProcedure";

        spyOn(aService, "testProcedure");
        spyOn(asyncService, "testProcedure");

        var params = {
            "aKey": "aValue"
        };
        aService.execute(procedureName, params, false);

        expect(aService.getLastDataSent().getFromQuery("aKey")).toEqual("aValue");

        asyncService.execute(procedureName, params, true);

        expect(asyncService.getLastDataSent().getFromQuery("aKey")).toEqual("aValue");

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


    it("emits a message ", function() {
        var aService = new CUORE.Service();
        var procedureName = "testProcedure";

        aService.testProcedure = function(params, eventName) {
            this.request("aUrl", params, eventName);
        };

        var mockedBus = {};
        mockedBus.emit = function(eventName, response) {};

        spyOn(mockedBus, "emit");
        spyOn(aService, "getBus").andReturn(mockedBus);
        aService.execute(procedureName, {}, false);

        expect(mockedBus.emit.mostRecentCall.args[1] instanceof CUORE.Message).toBeTruthy();
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