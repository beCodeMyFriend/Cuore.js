describe("Collapsable Panel", function() {

    afterEach(function() {
        var container = document.getElementById('xhtmlToTest');
        container.innerHTML = '';
    });

    it("inherits Component", function() {
        var aPanel = new CUORE.Components.Collapsable();

        expect(aPanel instanceof CUORE.Components.Collapsable).toBeTruthy();
        expect(aPanel instanceof CUORE.Component).toBeTruthy();
    });


    it("has its own class", function() {
        var aPanel = new CUORE.Components.Collapsable();
        spyOn(aPanel, 'addClass');

        aPanel.init();

        expect(aPanel.addClass).toHaveBeenCalledWith('collapsablePanel');
    });

    
});
