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

    describe('renderer', function() {

        it("change css class when collapse", function() {
            var container = createTestContainer();
            var aComponent = createDummyComponent();
            var aRenderer = new CUORE.Renderers.Collapsable();
            aRenderer.setContainer(container.id);
            aRenderer.draw(aComponent);


            aComponent.isCollapsed = jasmine.createSpy('isCollapsed').andReturn(false);

            aRenderer.update(aComponent);

            var DOMPanel = document.getElementById(aRenderer.htmlID);
            expect(CUORE.Dom.hasClass(DOMPanel, "uncollapsed")).toBeTruthy();
            expect(CUORE.Dom.hasClass(DOMPanel, "collapsed")).toBeFalsy();

            aComponent.isCollapsed = jasmine.createSpy('isCollapsed').andReturn(true);

            aRenderer.update(aComponent);

            expect(CUORE.Dom.hasClass(DOMPanel, "uncollapsed")).toBeFalsy();
            expect(CUORE.Dom.hasClass(DOMPanel, "collapsed")).toBeTruthy();
        });

        it("has height 0 when collapsed but has some height when not", function() {
            var container = createTestContainer();
            var aComponent = createDummyComponent();
            var aRenderer = new CUORE.Renderers.Collapsable();
            aRenderer.setContainer(container.id);
            aRenderer.draw(aComponent);

            aComponent.isCollapsed = jasmine.createSpy('isCollapsed').andReturn(true);
            aRenderer.update(aComponent);

            var DOMPanel = document.getElementById(aRenderer.htmlID);
            expect(DOMPanel.style.height).toEqual("0px");

            aComponent.isCollapsed = jasmine.createSpy('isCollapsed').andReturn(false);
            aRenderer.update(aComponent);

            expect(DOMPanel.style.height).toNotEqual("0px");
        });

        var createDummyComponent = function() {
                var aComponent = {};
                aComponent.doYouReplace = jasmine.createSpy('doYouReplace').andReturn(false);
                aComponent.doYouHijack = jasmine.createSpy('doYouHijack').andReturn(false);
                aComponent.getName = jasmine.createSpy('getName').andReturn('componentName');
                aComponent.isEnabled = jasmine.createSpy('isEnabled').andReturn(true);

                aComponent.getPanelLabel = jasmine.createSpy('getPanelLabel').andReturn('dummyText');
                return aComponent;
            };

        var createTestContainer = function() {
                var container = document.createElement('div');
                container.id = "testingContainer";
                var panel = document.getElementById("xhtmlToTest");
                panel.appendChild(container);

                return container;
            };

    });

});
