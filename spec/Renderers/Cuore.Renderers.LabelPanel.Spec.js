describe('Label Panel Renderer', function() {
        it('displays a text', function() {

            var aComponent = {};
            aComponent.getLabelText = jasmine.createSpy('getLabelText').andReturn('testLabel')
            aComponent.doYouReplace = jasmine.createSpy('doYouReplace').andReturn(false);
            aComponent.doYouHijack = jasmine.createSpy('doYouHijack').andReturn(false);
            aComponent.getName = jasmine.createSpy('getName').andReturn('aName');
            aComponent.isEnabled = jasmine.createSpy('isEnabled').andReturn(true);

            var aRenderer = new CUORE.Renderers.LabelPanel();
            aRenderer.setContainer(createTestContainer());

            aRenderer.render(aComponent);

            var DOMLabel = document.getElementById(aRenderer.htmlID);

            expect(DOMLabel.innerHTML).toEqual('testLabel');
        });

        var createTestContainer = function() {
                var container = document.createElement('div');
                container.id = "testingContainer";
                var panel = document.getElementById("xhtmlToTest");
                panel.appendChild(container);

                return container.id;
            };
});