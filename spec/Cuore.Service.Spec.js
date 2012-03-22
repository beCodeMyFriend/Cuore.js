describe("Service", function() {
    var aService,requests, xhr;

    beforeEach(function() {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        
        aService = new CUORE.Service();
        aService.testProcedure = function(params, eventName) {
            this.request("aUrl", params, eventName);
        };
        
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

    it("execute calls procedure on service", function() {
        var procedureName = "testProcedure";
        aService.testProcedure=jasmine.createSpy(procedureName);
        var params = {
            "testParam1": true,
            "testParam2": true
        };
        aService.execute(procedureName, params);
        expect(aService.testProcedure).toHaveBeenCalledWith(params,'ABSTRACT_testProcedure_EXECUTED');
    });
    
    it("call is  asyncronous ,only emmitting when request is done ", function() {
        spyOn(aService,"emit");
       
        aService.execute('testProcedure', {'ajusreehfkf':'sdddd'});

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


    it("emits a message with response encoded as a message", function() {
        var expectedMessage = new CUORE.Message('{"header":{},"query":{},"answer":{"anAnswerKey":"anAnswerValue"}}');
        var response = expectedMessage.asJson();

        var bus=CUORE.Bus;
    
        spyOn(bus, "emit");
        aService.emit("eventname", response);

        var theMessage = bus.emit.mostRecentCall.args[1];

        expect(theMessage.asJson()).toEqual(expectedMessage.asJson());
    });

    it("builds a unique name for every event sent", function() {
        var aService = new CUORE.Service();

        var procedureName = "procedureTest";
        var SEPARATOR = "_";
        var expectedName = aService.getName() + SEPARATOR + procedureName + SEPARATOR + aService.executionPrefix;

        expect(aService.getEventNameForExecution(procedureName)).toEqual(expectedName);
    });

    var lastRequest = function () {
        var last= requests[requests.length-1];
        return last;
    };
    
});