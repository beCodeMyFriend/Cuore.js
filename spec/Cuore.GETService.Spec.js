describe("ServiceGet", function() {
    
    var aService =new CUORE.GETService();

    beforeEach(function() {
        this.addMatchers({
            toBeInstanceOf: CUORE.Matchers.toBeInstanceOf
        });
    });
    
    it("extends service", function() {
        expect(aService).toBeInstanceOf(CUORE.Service);
    });
    

    it("doesn't use the CUORE.Core.request", function() {
        CUORE.Core.request = jasmine.createSpy("CUORE.Core.request");
        aService.request("", {}, ""); 
        expect(CUORE.Core.request).not.toHaveBeenCalled();
    });
    
    it("calls CUORE.Core.requestGet instead", function() {
        CUORE.Core.requestGet = jasmine.createSpy("CUORE.Core.requestGet");
        aService.request("", {}, ""); 
        expect(CUORE.Core.requestGet).toHaveBeenCalled();
    });
    
    it("doest not wrap params in a message", function() {
        CUORE.Core.requestGet = jasmine.createSpy("CUORE.Core.requestGet");
        var theParams = {'aKey': 'aValue'};
        
        aService.request("", theParams, "");
        
        expect(CUORE.Core.requestGet.mostRecentCall.args[1]).toEqual(theParams);
    });
    
    it("emits a message with response at answer", function() {
        var response = {'tal':'pascual'};
        spyOn(CUORE.Bus, "emit");
        
        aService.emit("eventname", response);

        var theMessage = CUORE.Bus.emit.mostRecentCall.args[1];
        expect(theMessage.answer).toEqual(response);
    });
});