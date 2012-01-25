describe("JService", function() {
    

    it("extends service", function() {
        var aService=new CUORE.JService();
        expect (aService instanceof CUORE.Service);
    });
    

    it("doesn't use the CUORE.Core.request", function() {
        var aService=new CUORE.JService();
        CUORE.Core.request=jasmine.createSpy("CUORE.Core.request");
        CUORE.Core.requestJSONP=jasmine.createSpy("CUORE.Core.requestJSONP");
        aService.request("", {}, ""); 
        expect(CUORE.Core.request).not.toHaveBeenCalled();
    });
    
    it("calls CUORE.Core.requestJSONP instead", function() {
        var aService=new CUORE.JService();
        CUORE.Core.requestJSONP=jasmine.createSpy("CUORE.Core.requestJSONP");
        aService.request("", {}, ""); 
        expect(CUORE.Core.requestJSONP).toHaveBeenCalled();
    });
    
    it("calls CUORE.Core.requestJSONP with the query of the message as param", function() {
        var aService=new CUORE.JService();
        CUORE.Core.requestJSONP=jasmine.createSpy("CUORE.Core.requestJSONP");
        
        var theParams = {'aKey': 'aValue'};
        
        aService.request("", theParams, "");
        
        expect(CUORE.Core.requestJSONP.mostRecentCall.args[1]).toEqual(theParams);
    });
    
    it("emits a message with response at answer", function() {
        var aService = new CUORE.JService();
        var response = {'tal':'pascual'};

        spyOn(CUORE.Bus, "emit");
        

        aService.emit("eventname", response);

        var theMessage = CUORE.Bus.emit.mostRecentCall.args[1];

        expect(theMessage.answer).toEqual(response);
    });
});