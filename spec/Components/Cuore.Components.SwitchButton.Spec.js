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

        expect(aButton instanceof CUORE.Components.SwitchButton).toBeTruthy();
        expect(aButton instanceof CUORE.Components.Button).toBeTruthy();
        expect(aButton instanceof CUORE.Component).toBeTruthy();
    });

    it("should have default labels", function () {
        var aButton = new CUORE.Components.SwitchButton();
        expect(aButton.getActiveLabel()).toEqual("CLICK!");
        expect(aButton.getInactiveLabel()).toEqual("CLICK!");
    });

    it("should request active and inactive key when drawn", function () {
        var container = createTestContainer();
        var keyActive = "testKeyActive";
        var keyInactive = "testKeyInactive";
        var aButton = new CUORE.Components.SwitchButton("buttonName", keyActive, keyInactive);
        var aDirectory = CUORE.Mocks.Directory();
        aButton.setDirectory(aDirectory);
        aButton.setContainer(container.id);

        aButton.draw();

        expect(aButton.getActiveKey()).toEqual(keyActive);
        expect(aButton.getInactiveKey()).toEqual(keyInactive);

        expect(aDirectory.execute).toHaveBeenCalledWith("LABELS", 'getLabel', {key:keyActive}, true);
        expect(aDirectory.execute).toHaveBeenCalledWith("LABELS", 'getLabel', {key:keyInactive}, true);
    });

    it("should switches state, label and cssclass when clicked", function () {
        var container = createTestContainer();
        var aButton = new CUORE.Components.SwitchButton("buttonName", "testKeyActive", "testKeyInactive");
        aButton.setDirectory(CUORE.Mocks.Directory());
        aButton.setContainer(container.id);

        var activeLabel = "active";
        var inactiveLabel = "inactive";
        var activeMessage = new CUORE.Message();
        activeMessage.putOnAnswer("text",activeLabel);

        var inactiveMessage = new CUORE.Message();
        inactiveMessage.putOnAnswer("text",inactiveLabel);

        aButton.setActiveLabel(activeMessage);
        aButton.setInactiveLabel(inactiveMessage);

        expect(aButton.isActive()).toBeTruthy();

        aButton.draw();

        var DOMButton = document.getElementById(aButton.getUniqueID());

        expect(aButton.isActive()).toBeTruthy();
        expect(CUORE.Dom.hasClass(DOMButton, "on")).toBeTruthy();
        expect(CUORE.Dom.hasClass(DOMButton, "off")).toBeFalsy();

        expect(DOMButton.innerHTML).toMatch(activeLabel);

        aButton.click();

        expect(aButton.isActive()).toBeFalsy();
        expect(CUORE.Dom.hasClass(DOMButton, "off")).toBeTruthy();
        expect(CUORE.Dom.hasClass(DOMButton, "on")).toBeFalsy();

        expect(DOMButton.innerHTML).toMatch(inactiveLabel);
    });

    it("should emit event when clicked", function () {
        var buttonName="buttonName";
        var someData="someData";
        var aDirectory=CUORE.Mocks.Directory();
        var aButton = new CUORE.Components.SwitchButton(buttonName, "testKeyActive", "testKeyInactive");
        aButton.setDirectory(aDirectory);
        aButton.setData(someData);

        aButton.click();

        expect(aDirectory.execute).toHaveBeenCalledWith("BUTTON", buttonName, someData);
    });

    it("should not emit event when clicked and false is passed as argument", function () {
        var aDirectory=CUORE.Mocks.Directory();
        var aButton = new CUORE.Components.SwitchButton("buttonName", "testKeyActive", "testKeyInactive");
        aButton.setDirectory(CUORE.Mocks.Directory());

        aButton.click(false);

        expect(aDirectory.execute).not.toHaveBeenCalled();
    });

    it("should get labelHandler when initialized", function () {
        var activeKeyEvent = "LABELS_getLabel_EXECUTED_activeKey";
        var inactiveKeyEvent = "LABELS_getLabel_EXECUTED_inactiveKey";

        var aButton = new CUORE.Components.SwitchButton("ButtonName", "activeKey", "inactiveKey");

        var events = aButton.getManagedEvents();

        expect(events).toContain(activeKeyEvent);
        expect(events).toContain(inactiveKeyEvent);

    });

    var createTestContainer = function() {
        var container = document.createElement('div');
        container.id ="testingContainer"
        document.getElementById("xhtmlToTest").appendChild(container);
        
        return container;
    };
});