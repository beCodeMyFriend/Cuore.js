describe("SwitchCollapseAndUncollapseHandler", function () {
    
    it("inherits Handler", function () {
        var aSwitchCollapseHandler = new CUORE.Handlers.SwitchCollapseAndUncollapse();

        expect(aSwitchCollapseHandler instanceof CUORE.Handler).toBeTruthy();
        expect(aSwitchCollapseHandler instanceof CUORE.Handlers.SwitchCollapseAndUncollapse).toBeTruthy();

    });

    it("should collapse and uncollapse", function () {
        var aComponent = new CUORE.Component();
        aComponent.status = true;

        aComponent.isCollapsed = function () {
            return aComponent.status;
        };

        aComponent.collapse = function () {
            aComponent.status = true;
        };

        aComponent.uncollapse = function () {
            aComponent.status = false;
        };

        var aSwitchCollapseHandler = new CUORE.Handlers.SwitchCollapseAndUncollapse();
        aComponent.addHandler("testEvent", aSwitchCollapseHandler);

        aSwitchCollapseHandler.handle();
        expect(aComponent.isCollapsed()).toBeFalsy();

        aSwitchCollapseHandler.handle();
        expect(aComponent.isCollapsed()).toBeTruthy();

        aSwitchCollapseHandler.handle();
        expect(aComponent.isCollapsed()).toBeFalsy();;
    });
});