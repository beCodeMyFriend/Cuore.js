describe("SwitchButton", function() {

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
        xhr.restore();
    });

    it("inherits Component and Button", function() {
        var keyActive = "testKeyActive";
        var keyInactive = "testKeyInactive";
        var aButton = new CUORE.Components.SwitchButton("buttonName", keyActive, keyInactive);

        expect(aButton instanceof CUORE.Components.SwitchButton).toBeTruthy();
        expect(aButton instanceof CUORE.Components.Button).toBeTruthy();
        expect(aButton instanceof CUORE.Component).toBeTruthy();
    });

    it("should have default labels", function() {
        var aButton = new CUORE.Components.SwitchButton();
        expect(aButton.getActiveLabel()).toEqual("CLICK!");
        expect(aButton.getInactiveLabel()).toEqual("CLICK!");
    });

    it("should request active and inactive key", function() {
        var aButton = new CUORE.Components.SwitchButton();
        spyOn(aButton, 'setI18NKey');

        aButton.init("buttonName", "testKeyActive", "testKeyInactive");

        expect(aButton.setI18NKey).toHaveBeenCalledWith("testKeyActive");
        expect(aButton.setI18NKey).toHaveBeenCalledWith("testKeyInactive");
    });

    describe('renderer', function() {


        afterEach(function() {
            var container = document.getElementById('xhtmlToTest');
            container.innerHTML = '';

        });
        it('switch class depending the state', function() {
            var container = createTestContainer();
            var aButton = createDummyComponent();
            var aRenderer = new CUORE.Renderers.SwitchButton();
            aRenderer.setContainer(container.id);
            aButton.isActive = jasmine.createSpy('isActive').andReturn(true);

            aRenderer.draw(aButton);

            var DOMButton = document.getElementById(aRenderer.htmlID);
            expect(CUORE.Dom.hasClass(DOMButton, "on")).toBeTruthy();
            expect(CUORE.Dom.hasClass(DOMButton, "off")).toBeFalsy();

            aButton.isActive = jasmine.createSpy('isActive').andReturn(false);
            aRenderer.update(aButton);

            expect(CUORE.Dom.hasClass(DOMButton, "off")).toBeTruthy();
            expect(CUORE.Dom.hasClass(DOMButton, "on")).toBeFalsy();
        });

        it('switch label depending the state', function() {
            var container = createTestContainer();
            var aButton = createDummyComponent();
            var aRenderer = new CUORE.Renderers.SwitchButton();
            aRenderer.setContainer(container.id);

            aButton.isActive = jasmine.createSpy('isActive').andReturn(true);
            aRenderer.draw(aButton);

            var DOMButton = document.getElementById(aRenderer.htmlID);
            expect(DOMButton.innerHTML).toMatch('activeLabel');

            aButton.isActive = jasmine.createSpy('isActive').andReturn(false);
            aRenderer.update(aButton);

            expect(DOMButton.innerHTML).toMatch("inactiveLabel");
        });

        var createDummyComponent = function() {
                var aComponent = {};
                aComponent.doYouReplace = jasmine.createSpy('doYouReplace').andReturn(false);
                aComponent.doYouHijack = jasmine.createSpy('doYouHijack').andReturn(false);
                aComponent.getName = jasmine.createSpy('getName').andReturn('componentName');
                aComponent.isEnabled = jasmine.createSpy('isEnabled').andReturn(true);

                aComponent.getButtonName = jasmine.createSpy('getButtonName').andReturn('dummyText');
                aComponent.getActiveLabel = jasmine.createSpy('getActiveLabel').andReturn('activeLabel');
                aComponent.getInactiveLabel = jasmine.createSpy('getInactiveLabel').andReturn('inactiveLabel');
                return aComponent;
            };
        var createTestContainer = function() {
                var container = document.createElement('div');
                container.id = "testingContainer"
                document.getElementById("xhtmlToTest").appendChild(container);

                return container;
            };
    });

    it("switches state when clicked", function() {
        var aButton = new CUORE.Components.SwitchButton("buttonName", "testKeyActive", "testKeyInactive");
        aButton.setDirectory(CUORE.Mocks.Directory());

        expect(aButton.isActive()).toBeTruthy();

        aButton.click();

        expect(aButton.isActive()).toBeFalsy();
    });

    it("should emit event when clicked", function() {
        var buttonName = "buttonName";
        var someData = "someData";
        var aDirectory = CUORE.Mocks.Directory();
        var aButton = new CUORE.Components.SwitchButton(buttonName, "testKeyActive", "testKeyInactive");

        aButton.setDirectory(aDirectory);
        aButton.setData(someData);
        aButton.click();

        expect(aDirectory.execute).toHaveBeenCalledWith("BUTTON", buttonName, someData);
    });

    it("should not emit event when clicked and false is passed as argument", function() {
        var aDirectory = CUORE.Mocks.Directory();
        var aButton = new CUORE.Components.SwitchButton("buttonName", "testKeyActive", "testKeyInactive");

        aButton.setDirectory(CUORE.Mocks.Directory());
        aButton.click(false);

        expect(aDirectory.execute).not.toHaveBeenCalled();
    });
});
