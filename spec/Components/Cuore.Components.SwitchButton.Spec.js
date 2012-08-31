describe("SwitchButton", function () {

    var xhr;

    beforeEach(function(){
        xhr = sinon.useFakeXMLHttpRequest();
        var requests = [];
        
        xhr.onCreate = function (xhr) {
            requests.push(xhr);
        };
      
        CUORE.Core.createXHR = function(){
            return xhr;
        };

        this.addMatchers({
            toBeInstanceOf: CUORE.Matchers.toBeInstanceOf
        });
    });

    afterEach(function(){
        var container = document.getElementById('xhtmlToTest');
        container.innerHTML = '';

        xhr.restore();
    });

    it("inherits Component and Button", function () {
        var keyActive = "testKeyActive";
        var keyInactive = "testKeyInactive";
        var aButton = new CUORE.Components.SwitchButton("buttonName", keyActive, keyInactive);

        expect(aButton).toBeInstanceOf(CUORE.Components.SwitchButton);
        expect(aButton).toBeInstanceOf(CUORE.Components.Button);
        expect(aButton).toBeInstanceOf(CUORE.Component);
    });

    it("should have default labels", function () {
        var aButton = new CUORE.Components.SwitchButton();
        expect(aButton.getActiveLabel()).toEqual("CLICK!");
        expect(aButton.getInactiveLabel()).toEqual("CLICK!");
    });

    it("should request active and inactive key", function () {
        var aButton = new CUORE.Components.SwitchButton();
        spyOn(aButton, 'setI18NKey');

        aButton.init("buttonName", "testKeyActive", "testKeyInactive");

        expect(aButton.setI18NKey).toHaveBeenCalledWith("testKeyActive");
        expect(aButton.setI18NKey).toHaveBeenCalledWith("testKeyInactive");
    });

    it("should switches state, label and cssclass when clicked", function () {
        var container = createTestContainer();
        var aButton = new CUORE.Components.SwitchButton("buttonName", "testKeyActive", "testKeyInactive");
        aButton.setDirectory(CUORE.Mocks.Directory());
        aButton.setContainer(container.id);

        aButton.draw();

        var DOMButton = document.getElementById(aButton.getUniqueID());

        expect(aButton.isActive()).toBeTruthy();
        expect(CUORE.Dom.hasClass(DOMButton, "on")).toBeTruthy();
        expect(CUORE.Dom.hasClass(DOMButton, "off")).toBeFalsy();

        expect(DOMButton.innerHTML).toMatch("testKeyActive");

        aButton.click();

        expect(aButton.isActive()).toBeFalsy();
        expect(CUORE.Dom.hasClass(DOMButton, "off")).toBeTruthy();
        expect(CUORE.Dom.hasClass(DOMButton, "on")).toBeFalsy();

        expect(DOMButton.innerHTML).toMatch("testKeyInactive");
    });

    it("should emit event when clicked", function () {
        var buttonName = "buttonName";
        var someData = "someData";
        var aDirectory = CUORE.Mocks.Directory();
        var aButton = new CUORE.Components.SwitchButton(buttonName, "testKeyActive", "testKeyInactive");
        
        aButton.setDirectory(aDirectory);
        aButton.setData(someData);
        aButton.click();

        expect(aDirectory.execute).toHaveBeenCalledWith("BUTTON", buttonName, someData);
    });

    it("should not emit event when clicked and false is passed as argument", function () {
        var aDirectory = CUORE.Mocks.Directory();
        var aButton = new CUORE.Components.SwitchButton("buttonName", "testKeyActive", "testKeyInactive");
        
        aButton.setDirectory(CUORE.Mocks.Directory());
        aButton.click(false);

        expect(aDirectory.execute).not.toHaveBeenCalled();
    });

    var createTestContainer = function() {
        var container = document.createElement('div');
        container.id ="testingContainer"
        document.getElementById("xhtmlToTest").appendChild(container);
        
        return container;
    };
});