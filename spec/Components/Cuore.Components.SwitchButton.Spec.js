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

    it("should ignore undefined keys when getLabel called", function () {
        var aButton = new CUORE.Components.SwitchButton();
        var calledGetLabelService = false;
        aButton.getLabelService = function () {
            calledGetLabelService = true;
        };
        aButton.getLabel(null);
        aButton.getLabel(undefined);
        expect(calledGetLabelService).toBeFalsy();
    });

    it("should request active and inactive key when drawn", function () {

        var container = createTestContainer();
        var keyActive = "testKeyActive";
        var keyInactive = "testKeyInactive";
        var aButton = new CUORE.Components.SwitchButton("buttonName", keyActive, keyInactive);
        aButton.setContainer(container.id);

        var labelsRequested = [];
        aButton.getLabel = function (aLabel) {
            labelsRequested.push(aLabel);
        };

        aButton.draw();

        expect(aButton.getActiveKey()).toEqual(keyActive);
        expect(aButton.getInactiveKey()).toEqual(keyInactive);

        expect(labelsRequested).toContain(keyActive);
        expect(labelsRequested).toContain(keyInactive);

    });

    it("should switches state, label and cssclass when clicked", function () {
        var container = createTestContainer();
        var aButton = new CUORE.Components.SwitchButton("buttonName", "testKeyActive", "testKeyInactive");
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
        var aButton = new CUORE.Components.SwitchButton("buttonName", "testKeyActive", "testKeyInactive");

        var aService = {};
        aService.execute = function() {};
        spyOn(aService, 'execute');

        aButton.getService = function () {
            return aService;
        };

        aButton.click();

        expect(aService.execute).toHaveBeenCalled();

        aService.execute.reset();

        aButton.click(false);

        expect(aService.execute).not.toHaveBeenCalled();
    });

    it("should get labelHandler when initialized", function () {
        var activeKeyEvent = "LABELS_getLabel_EXECUTED_activeKey";
        var inactiveKeyEvent = "LABELS_getLabel_EXECUTED_inactiveKey";

        var aButton = new CUORE.Components.SwitchButton("ButtonName", "activeKey", "inactiveKey");

        var events = aButton.getManagedEvents();

        expect(events).toContain(activeKeyEvent);
        expect(events).toContain(inactiveKeyEvent);

    });

    function createTestContainer() {
		var container = document.createElement('div');
        container.id ="testingContainer"
        document.getElementById("xhtmlToTest").appendChild(container);
        
        return container;
    }

});