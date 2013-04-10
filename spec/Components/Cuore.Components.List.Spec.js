describe("List", function() {

    var aList;

    beforeEach(function() {
        aList = new CUORE.Components.List();
    });

    it("extends Component", function() {
        expect(aList instanceof CUORE.Components.List).toBeTruthy();
    });
    
    it("updates the renderer when filling the list", function() {
       spyOn(aList, 'updateRender');
       
       aList.fillList([]);
       
       expect(aList.updateRender).toHaveBeenCalled();
    });
    
    
    it("updates the renderer when filling the list", function() {
        var list = ["alfa", "beta", "gamma"];
       
       aList.fillList(list);
       
       expect(aList.size()).toEqual(3);
    });

    it("has a method for accesing items in the list", function() {
                
        var list = ["alfa", "beta", "gamma"];
        aList.fillList(list);

        expect(aList.item(1)).toEqual('beta');
    });
    
    it('has its own renderer', function() {
        expect(aList.renderer instanceof CUORE.Renderers.List).toBeTruthy();
    });

});