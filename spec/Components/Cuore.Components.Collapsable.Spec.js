describe("Collapsable Panel", function() {

    beforeEach(function(){
        this.addMatchers({
            toBeInstanceOf: CUORE.Matchers.toBeInstanceOf
        });
    });

    afterEach(function() {
        var container = document.getElementById('xhtmlToTest');
        container.innerHTML = '';
    });

    it("inherits Component", function() {
        var aPanel = new CUORE.Components.Collapsable();

        expect(aPanel).toBeInstanceOf(CUORE.Components.Collapsable);
        expect(aPanel).toBeInstanceOf(CUORE.Component);
    });


    it("has its own class", function() {
        var aPanel = new CUORE.Components.Collapsable();
        spyOn(aPanel, 'addClass');

        aPanel.init();

        expect(aPanel.addClass).toHaveBeenCalledWith('collapsablePanel');
    });

    
});
