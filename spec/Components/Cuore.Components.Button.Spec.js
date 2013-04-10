describe("Button", function() {

    var xhr;

    beforeEach(function() {
        xhr = sinon.useFakeXMLHttpRequest();
        var requests = [];

        xhr.onCreate = function(xhr) {
            requests.push(xhr);
        };

        CUORE.Core.createXHR = function() {
            return xhr;
        };
    });

    afterEach(function() {
        var container = document.getElementById('xhtmlToTest');
        container.innerHTML = '';

        xhr.restore();
    });

    it("inherits Component", function() {
        var aButton = new CUORE.Components.Button();

        expect(aButton instanceof CUORE.Components.Button).toBeTruthy();
        expect(aButton instanceof CUORE.Component).toBeTruthy();
    });

    it("sets I18NKey in construct", function() {
        var aI18NKey = "CanonicalKey";
        var aButton = new CUORE.Components.Button("buttonName", aI18NKey);
        expect(aButton.getButtonText()).toEqual(aI18NKey);
    });

    it("default text is 'Click!!'", function() {
        var container = createTestContainer();
        var aButton = new CUORE.Components.Button();

        expect(aButton.getButtonText()).toEqual("CLICK!");
    });

    it("default name is 'aButton' and service is defaulted to 'BUTTON'", function() {
        var aButton = new CUORE.Components.Button();
        var aDirectory = CUORE.Mocks.Directory();
        aButton.setDirectory(aDirectory);

        aButton.click();

        expect(aDirectory.execute).toHaveBeenCalledWith("BUTTON", 'aButton', null);
    });


    describe('renderer', function() {

        it("generates an anchor in DOM with a span for css replacement when it is drawn", function() {
            var container = createTestContainer();

            var buttonText = "buttonText";


            var aComponent = createDummyComponent();
            aComponent.getButtonText = jasmine.createSpy('getButtonText').andReturn(buttonText);
            var aRenderer = new CUORE.Renderers.Button();
            aRenderer.setContainer(container.id);

            aRenderer.draw(aComponent);



            var DOMButton = document.getElementById(aRenderer.htmlID);

            expect(DOMButton.tagName).toEqual("A");

            var innerSpan = DOMButton.getElementsByTagName('span')[0];
            expect(innerSpan).toBeDefined();
            expect(innerSpan.innerHTML).toEqual(buttonText);
        });

        it("has CSS class 'button'", function() {
            var container = createTestContainer();
            var aButton = createDummyComponent();
            var aRenderer = new CUORE.Renderers.Button();
            aRenderer.setContainer(container.id);

            aRenderer.draw(aButton);

            var DOMButton = document.getElementById(aRenderer.htmlID);
            expect(CUORE.Dom.hasClass(DOMButton, 'button')).toBeTruthy();
        });


        it("has a click event that when it is fired calls click", function() {
            var container = createTestContainer();
            var aButton = createDummyComponent();
            var aRenderer = new CUORE.Renderers.Button();
            aRenderer.setContainer(container.id);

            aButton.click = jasmine.createSpy('click');

            aRenderer.draw(aButton);

            var DOMButton = document.getElementById(aRenderer.htmlID);
            var events = CUORE.Dom.Event.hasEvents(DOMButton, 'click');

            expect(events).toBeTruthy();
            CUORE.Dom.Event.fire(DOMButton, 'click');

            expect(aButton.click).toHaveBeenCalled();
        });


        it("does not click when disabled", function() {
            var container = createTestContainer();
            var aButton = createDummyComponent();
            var aRenderer = new CUORE.Renderers.Button();
            aRenderer.setContainer(container.id);
            aButton.isEnabled = jasmine.createSpy('isEnabled').andReturn(false);

            aRenderer.draw(aButton);

            var DOMButton = document.getElementById(aRenderer.htmlID);
            expect(CUORE.Dom.Event.hasEvents(DOMButton, 'click')).toBeFalsy();
        });

        var createDummyComponent = function() {
            var aComponent = {};
            aComponent.doYouReplace = jasmine.createSpy('doYouReplace').andReturn(false);
            aComponent.doYouHijack = jasmine.createSpy('doYouHijack').andReturn(false);
            aComponent.getName = jasmine.createSpy('getName').andReturn('componentName');
            aComponent.isEnabled = jasmine.createSpy('isEnabled').andReturn(true);

            aComponent.getButtonName = jasmine.createSpy('getButtonName').andReturn('buttonName');
            aComponent.getButtonText = jasmine.createSpy('getButtonText').andReturn('buttonText');

            return aComponent;
        }

    });



    it("click calls button service", function() {
        var buttonName = "buttonName";
        var aButton = new CUORE.Components.Button(buttonName, "CanonicalKey");
        var someData = "Some Data";
        aButton.setData(someData);
        var aDirectory = CUORE.Mocks.Directory();
        aButton.setDirectory(aDirectory);

        aButton.click();

        expect(aDirectory.execute).toHaveBeenCalledWith("BUTTON", buttonName, someData);
    });

    it("default event is stopped even when disabled", function() {
        var container = createTestContainer();

        var buttonName = "buttonName";
        var aButton = new CUORE.Components.Button(buttonName, "CanonicalKey");
        aButton.setContainer(container.id);
        aButton.disable();
        spyOn(CUORE.Dom.Event, 'stopDefault');
        aButton.draw();

        expect(CUORE.Dom.Event.stopDefault).toHaveBeenCalled();
    });

    it("allows disabling and enabling behaviour", function() {
        var buttonName = "buttonName";
        var undrawnButton = new CUORE.Components.Button(buttonName, "CanonicalKey");

        expect(undrawnButton.isEnabled()).toBeTruthy();
        undrawnButton.disable();
        expect(undrawnButton.isEnabled()).toBeFalsy();
        undrawnButton.enable();
        expect(undrawnButton.isEnabled()).toBeTruthy();
    });

    it("uses the container as panel when component has hijack behaviour", function() {
        var container = document.createElement('a');
        container.id = "testingContainer";
        var panel = document.getElementById("xhtmlToTest");
        panel.appendChild(container);

        var aButton = new CUORE.Components.Button('buttonName', "CanonicalKey");
        aButton.behave(CUORE.Behaviours.HIJACK);
        aButton.setContainer(container.id);
        aButton.draw();

        expect(container.childNodes[0].tagName).toEqual('SPAN');
    });

    it("only hijacks when panel it's an 'a' defaulting to append", function() {
        var container = document.createElement('div');
        container.id = "testingContainer";
        var panel = document.getElementById("xhtmlToTest");
        panel.appendChild(container);

        var aButton = new CUORE.Components.Button('buttonName', "CanonicalKey");
        aButton.behave(CUORE.Behaviours.HIJACK);
        aButton.setContainer(container.id);
        aButton.draw();

        expect(container.childNodes[0].tagName).toEqual('A');
    });

    var createTestContainer = function() {
            var container = document.createElement('div');
            container.id = "testingContainer";
            var panel = document.getElementById("xhtmlToTest");
            panel.appendChild(container);

            return container;
        };
});
