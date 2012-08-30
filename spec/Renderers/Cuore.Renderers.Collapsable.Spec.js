describe('Collapsable Panel Renderer', function() {

        afterEach(function() {
            var container = document.getElementById('xhtmlToTest');
            container.innerHTML = '';
        });

        it("change css class when collapse", function() {
            var aComponent = createDummyComponent();
            var aRenderer = new CUORE.Renderers.Collapsable();
            aRenderer.setContainer(createTestContainer());
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
            var aComponent = createDummyComponent();
            var aRenderer = new CUORE.Renderers.Collapsable();
            aRenderer.setContainer(createTestContainer());
            aRenderer.draw(aComponent);

            aComponent.isCollapsed = jasmine.createSpy('isCollapsed').andReturn(true);
            aRenderer.update(aComponent);

            var DOMPanel = document.getElementById(aRenderer.htmlID);
            expect(DOMPanel.style.height).toEqual("0px");

            aComponent.isCollapsed = jasmine.createSpy('isCollapsed').andReturn(false);
            aRenderer.update(aComponent);

            expect(DOMPanel.style.height).toNotEqual("0px");
        });

        it("keeps original content when label not defined", function() {
            var aComponent = createDummyComponent();
            var aRenderer = new CUORE.Renderers.Collapsable();
            aRenderer.setContainer(createTestContainer());

            aComponent.getPanelLabel = jasmine.createSpy('getPanelLabel').andReturn(null);

            aRenderer.render(aComponent);

            var DOMPanel = document.getElementById(aRenderer.htmlID);

            DOMPanel.innerHTML='defaultContent';

            aRenderer.update(aComponent);

            expect(DOMPanel.innerHTML).toEqual('defaultContent');
        });

        var createDummyComponent = function() {
                var aComponent = {};
                aComponent.doYouReplace = jasmine.createSpy('doYouReplace').andReturn(false);
                aComponent.doYouHijack = jasmine.createSpy('doYouHijack').andReturn(false);
                aComponent.getName = jasmine.createSpy('getName').andReturn('componentName');
                aComponent.isEnabled = jasmine.createSpy('isEnabled').andReturn(true);
                aComponent.isCollapsed = jasmine.createSpy('isCollapsed').andReturn(true);


                aComponent.getPanelLabel = jasmine.createSpy('getPanelLabel').andReturn('dummyText');
                return aComponent;
            };

        var createTestContainer = function() {
                var container = document.createElement('div');
                container.id = "testingContainer";
                var panel = document.getElementById("xhtmlToTest");
                panel.appendChild(container);

                return container.id;
            };

    });
