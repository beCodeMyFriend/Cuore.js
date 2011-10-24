describe("A Directory", function () {

    var mockService=function (name){
        var service={};
        service.getName = jasmine.createSpy(name+'.getName').andReturn(name);
        service.execute = jasmine.createSpy(name+'.execute');
        return service;        
    };
        
    var aDirectory;
    beforeEach(function() {
        aDirectory = new CUORE.Directory();
    });
    
    describe("with a service called 'TAL'", function() {
        
        var tal="TAL";
        var talService;
        
        beforeEach(function() {
            talService = mockService(tal);
            
            aDirectory.add(talService);
        });
        
        it("the service 'TAL' will be asked for its name", function () {
            expect(talService.getName).toHaveBeenCalled();
        });
    
        it("and the listing will contain 'TAL'", function () {
            expect(aDirectory.list()).toContain(tal);
        });
        
        it("when service 'PASCUAL' is added, then the listing will contain 'TAL' and 'PASCUAL'", function () {
            var pascual="PASCUAL";
        
            aDirectory.add(mockService(pascual));
            
            expect(talService.getName).toHaveBeenCalled();
            expect(aDirectory.list()).toContain(tal);
            expect(aDirectory.list()).toContain(pascual);
        });
        
        it("when execute is called for 'TAL' service, the execute method of the 'TAL' service will be called", function() {
            var procedureName = "CUAL";
            var params = "parameters";
            var asynchronous = false;
            
            aDirectory.execute(tal, procedureName, params, asynchronous);
            
            expect(talService.execute).toHaveBeenCalledWith(procedureName, params, asynchronous);
        });
        
        it("when execute is called with a non existing service name, it will do nothing", function() {
            var procedureName = "CUAL";
            var params = "parameters";
            var asynchronous = false;
            
            aDirectory.execute("NOT EXISTS", procedureName, params, asynchronous);
            
            expect(talService.execute).not.toHaveBeenCalled();
        });
        
        it("(DEPRECATED) getService('TAL') will return the 'TAL' service",function(){
            expect(aDirectory.getService(tal)).toBe(talService);
        });
        
        it("(DEPRECATED) getService('NOT EXISTS') will return an instance of NullService",function(){
            expect(aDirectory.getService('NOT EXISTS') instanceof CUORE.Services.Null).toBeTruthy();
        });
    });

});