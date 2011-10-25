describe("A Registry", function () {

    beforeEach(function(){
        this.addMatchers({
            toHaveBeenCalledOnceWithTheComponent:function(comp) {
                var spy=this.actual;
                this.message=function() {
                    return "Expected the spy "+jasmine.pp(spy)+" to have been called with the component "+comp.getName();
                }
                return spy.callCount==1 && spy.mostRecentCall.args[0]==comp;
            }
        });
    });
    
    it("can register components ", function () {
        var aRegistry= new CUORE.Registry();
        expect(aRegistry.size()).toEqual(0);
        var aComponent=new CUORE.Component();
        
        
        aRegistry.register(aComponent);
        expect(aRegistry.size()).toEqual(1);
        aRegistry.register(aComponent);
        expect(aRegistry.size()).toEqual(1);
    });
    
    it("can iterate with 1 component", function() {
        var aRegistry= new CUORE.Registry();
        var aComponent=new CUORE.Component();
        aRegistry.register(aComponent);
        
        var callback=jasmine.createSpy('callback');
        
        aRegistry.each(callback);
        
        expect(callback).toHaveBeenCalledOnceWithTheComponent(aComponent);
    });
    
});