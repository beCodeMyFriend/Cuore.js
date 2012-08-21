describe("Input", function() {

    var aComponent;

    beforeEach(function() {
        aComponent = new CUORE.Components.Input("CanonicalKey");
    });

    it("inherits Component", function() {
        expect(aComponent instanceof CUORE.Components.Input).toBeTruthy();
        expect(aComponent instanceof CUORE.Component).toBeTruthy();
    });


    it("allows to get its value", function() {
        aComponent.renderer.getValue = jasmine.createSpy('getValue').andReturn('testText');

        expect(aComponent.getValue()).toEqual('testText');

        aComponent.setValue('testText');
        aComponent.renderer.getValue = jasmine.createSpy('getValue').andReturn('');

        expect(aComponent.getValue()).toEqual('');
    });

    it("allows to set a value", function() {
        aComponent.updateRender = jasmine.createSpy('updateRender');

        aComponent.setValue("testText");

        expect(aComponent.updateRender).toHaveBeenCalled();
    });

    it("allows to get its value", function() {
        aComponent.renderer.getValue = jasmine.createSpy('getValue').andReturn('');

        expect(aComponent.getValue()).toEqual('');
    });

    it("allows to set the name to be submitted in the form", function() {
        aComponent.setFormName('aName');

        expect(aComponent.getFormName()).toEqual('aName');
    });

    it("allows changing the type", function() {
        expect(aComponent.type).toEqual("text");

        aComponent = new CUORE.Components.Input(undefined, "password");
        expect(aComponent.type).toEqual("password");
    });

    describe('renderer', function() {

        afterEach(function() {
            var container = document.getElementById('xhtmlToTest');
            container.innerHTML = '';
        });

        it("is drawn in a container", function() {
            var theComponent = createDummyComponent();
            var aRenderer = new CUORE.Renderers.Input();
            var container = createTestContainer();
            aRenderer.setContainer(container.id);

            aRenderer.render(theComponent);

            var DOMObject = document.getElementById(aRenderer.htmlID);

            expect(CUORE.Dom.hasClass(DOMObject, "inputJS")).toBeTruthy();

            var children = DOMObject.getElementsByTagName("input");
            expect(children.length).toEqual(1);
            expect(children[0].type).toEqual('text');
            children = DOMObject.getElementsByTagName("label");
            expect(children.length).toEqual(1);
            expect(children[0].innerHTML).toEqual('the input text');
        });

        it("renders the name attribute when provided", function() {
            var aComponent = createDummyComponent();
            var aRenderer = new CUORE.Renderers.Input();
            var container = createTestContainer();
            aRenderer.setContainer(container.id);

            aRenderer.render(aComponent);

            var DOMInput = document.getElementById(aRenderer.htmlID).getElementsByTagName("input")[0];

            expect(DOMInput.name).toEqual('the form name');

            aComponent.getFormName = jasmine.createSpy('getFormName').andReturn('');
            aRenderer.render(aComponent);

            expect(DOMInput.name).toEqual('');
        });


        var createTestContainer = function() {
                var container = document.createElement('div');
                container.id = "testingContainer";
                var panel = document.getElementById("xhtmlToTest");
                panel.appendChild(container);

                return container;
            };
        var createDummyComponent = function() {
                var aComponent = {};
                aComponent.doYouReplace = jasmine.createSpy('doYouReplace').andReturn(false);
                aComponent.doYouHijack = jasmine.createSpy('doYouHijack').andReturn(false);
                aComponent.getName = jasmine.createSpy('getName').andReturn('componentName');
                aComponent.isEnabled = jasmine.createSpy('isEnabled').andReturn(true);

                aComponent.type = "text";
                aComponent.getInputText = jasmine.createSpy('getInputText').andReturn('the input text');
                aComponent.getFormName = jasmine.createSpy('getFormName').andReturn('the form name');
                return aComponent;
            };
    });
});