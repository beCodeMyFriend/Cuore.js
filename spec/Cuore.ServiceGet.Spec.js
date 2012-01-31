describe("ServiceGet", function() {    

    it("extends service", function() {
        var aService=new CUORE.ServiceGet();
        expect (aService instanceof CUORE.Service);
    });
    

    it("doesn't use the CUORE.Core.request", function() {
        var aService = new CUORE.ServiceGet();
        CUORE.Core.request = jasmine.createSpy("CUORE.Core.request");
        CUORE.Core.requestGet = jasmine.createSpy("CUORE.Core.requestGet");
        aService.request("", {}, ""); 
        expect(CUORE.Core.request).not.toHaveBeenCalled();
    });
    
    it("calls CUORE.Core.requestGet instead", function() {
        var aService = new CUORE.ServiceGet();
        CUORE.Core.requestGet = jasmine.createSpy("CUORE.Core.requestGet");
        aService.request("", {}, ""); 
        expect(CUORE.Core.requestGet).toHaveBeenCalled();
    });
    
    it("doest not wrap params in a message", function() {
        var aService=new CUORE.ServiceGet();
        CUORE.Core.requestGet = jasmine.createSpy("CUORE.Core.requestGet");
        
        var theParams = {'aKey': 'aValue'};
        
        aService.request("", theParams, "");
        
        expect(CUORE.Core.requestGet.mostRecentCall.args[1]).toEqual(theParams);
    });
    
    it("emits a message with response at answer", function() {
        var aService = new CUORE.ServiceGet();
        var response = {'tal':'pascual'};

        spyOn(CUORE.Bus, "emit");
        
        aService.emit("eventname", response);

        var theMessage = CUORE.Bus.emit.mostRecentCall.args[1];

        expect(theMessage.answer).toEqual(response);
    });
});