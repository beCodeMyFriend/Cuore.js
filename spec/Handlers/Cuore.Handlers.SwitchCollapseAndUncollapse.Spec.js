describe("SwitchCollapseAndUncollapseHandler", function () {

    beforeEach(function() {
            this.addMatchers({
                toBeInstanceOf: CUORE.Matchers.toBeInstanceOf
            });
    });    

    it("inherits Handler", function () {
        var aSwitchCollapseHandler = new CUORE.Handlers.SwitchCollapseAndUncollapse();

        expect(aSwitchCollapseHandler).toBeInstanceOf(CUORE.Handler);
        expect(aSwitchCollapseHandler).toBeInstanceOf(CUORE.Handlers.SwitchCollapseAndUncollapse);
    });

    it("should collapse and uncollapse", function () {
        var aComponent = new CUORE.Component();

        aComponent.collapse = jasmine.createSpy("collapse");
        aComponent.uncollapse = jasmine.createSpy("uncollapse");

        var aSwitchCollapseHandler = new CUORE.Handlers.SwitchCollapseAndUncollapse();
        aComponent.addHandler("testEvent", aSwitchCollapseHandler);

        aComponent.isCollapsed = sinon.stub().returns(false);
        aSwitchCollapseHandler.handle();
        expect(aComponent.collapse).toHaveBeenCalled();
        aComponent.isCollapsed = sinon.stub().returns(true);
        aSwitchCollapseHandler.handle();
        expect(aComponent.uncollapse).toHaveBeenCalled();
    });
});