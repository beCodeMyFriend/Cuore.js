describe("Button", function () {
	
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
   
    it("inherits Component", function () {
        var aButton = new CUORE.Components.Button();

        expect(aButton instanceof CUORE.Components.Button).toBeTruthy();
        expect(aButton instanceof CUORE.Component).toBeTruthy();
    });

    it("sets I18NKey in construct", function () {
        var aI18NKey = "CanonicalKey";
        var aButton = new CUORE.Components.Button("buttonName", aI18NKey);
        expect(aButton.getI18NKey()).toEqual(aI18NKey);
    });

    it("default text is 'Click!!'", function () {
        var container = createTestContainer();
        var aButton = new CUORE.Components.Button();
        aButton.setContainer(container.id);
        expect(aButton.getText()).toEqual("CLICK!");

        aButton.draw();

        var DOMButton = document.getElementById(aButton.getUniqueID());
        expect(DOMButton.innerHTML).toMatch("CLICK!");
    });

    it("default name is 'aButton' and service is defaulted to 'BUTTON'", function () {
        var aButton = new CUORE.Components.Button();
        var aDirectory = CUORE.Mocks.Directory();
        aButton.setDirectory(aDirectory);

        aButton.click();

        expect(aDirectory.execute).toHaveBeenCalledWith("BUTTON", 'aButton', null);
    });

    it("generates an anchor in DOM with a span for css replacement when it is drawn", function () {
        var container = createTestContainer();

        var buttonName = "buttonName";
        var aButton = new CUORE.Components.Button(buttonName, "CanonicalKey");
        aButton.setContainer(container.id);

        aButton.draw();

        var buttonText = "buttonText";
        aButton.setText(buttonText);

        var aDOMClass = "aCssClass";

        aButton.addClass(aDOMClass);
        var DOMButton = document.getElementById(aButton.getUniqueID());
        
        expect(DOMButton.tagName).toEqual("A");
        expect(DOMButton.innerHTML).toMatch(buttonText);

        var innerSpan = DOMButton.getElementsByTagName('span')[0];
        expect(innerSpan).toBeDefined();
        expect(innerSpan.innerHTML).toEqual(buttonText);

        expect(CUORE.Dom.hasClass(DOMButton, aDOMClass)).toBeTruthy();
    });

    it("has CSS class 'button'", function () {
        var container = createTestContainer();
        var buttonClass="button";
        var aButton = new CUORE.Components.Button("buttonName", "CanonicalKey");
        aButton.setContainer(container.id);
        aButton.draw();


        var DOMButton = document.getElementById(aButton.getUniqueID());
        expect(CUORE.Dom.hasClass(DOMButton, buttonClass)).toBeTruthy();
    });
    
    it("has a click event that when it is fired calls click", function () {
        var container = createTestContainer();

        var buttonName = "buttonName";
        var aButton = new CUORE.Components.Button(buttonName, "CanonicalKey");
        aButton.setContainer(container.id);
        spyOn(aButton,'click');
        
        aButton.draw();

        var DOMButton = document.getElementById(aButton.getUniqueID());
        var events = CUORE.Dom.Event.hasEvents(DOMButton, 'click');

        expect(events).toBeTruthy();
        CUORE.Dom.Event.fire(DOMButton, 'click');

        expect(aButton.click).toHaveBeenCalled();
    });

    it("click calls button service", function () {
        var buttonName = "buttonName";
        var aButton = new CUORE.Components.Button(buttonName, "CanonicalKey");
        var someData="Some Data";
        aButton.setData(someData);
        var aDirectory = CUORE.Mocks.Directory();
        aButton.setDirectory(aDirectory);

        aButton.click();

        expect(aDirectory.execute).toHaveBeenCalledWith("BUTTON", buttonName, someData);
    });
    
    it("default event is stopped even when disabled", function () {
        var container = createTestContainer();

        var buttonName = "buttonName";
        var aButton = new CUORE.Components.Button(buttonName, "CanonicalKey");
        aButton.setContainer(container.id);
        aButton.disable();
        spyOn(CUORE.Dom.Event, 'stopDefault');
        aButton.draw();

        expect(CUORE.Dom.Event.stopDefault).toHaveBeenCalled();
    });
    
    it("allows disabling and enabling behaviour", function () {
        var buttonName = "buttonName";
        var undrawnButton = new CUORE.Components.Button(buttonName, "CanonicalKey");

        expect(undrawnButton.isEnabled()).toBeTruthy();
        undrawnButton.disable();
        expect(undrawnButton.isEnabled()).toBeFalsy();
        undrawnButton.enable();
        expect(undrawnButton.isEnabled()).toBeTruthy();
    });

    it("has enabled buttons that fire click event and disabled buttons that dont", function () {
        var container = createTestContainer();
        var buttonName = "buttonName";
        var aButton = new CUORE.Components.Button(buttonName, "CanonicalKey");

        var buttonClicked = false;

        aButton.click = function () {
            buttonClicked = true;
        };

        aButton.setContainer(container.id);

        aButton.draw();

        var DOMButton = document.getElementById(aButton.getUniqueID());

        aButton.disable();

        CUORE.Dom.Event.fire(DOMButton, 'click');
        expect(buttonClicked).toBeFalsy();

        buttonClicked = false;

        aButton.enable();
        CUORE.Dom.Event.fire(DOMButton, 'click');
        expect(buttonClicked).toBeTruthy();
    });

    it("has disabled buttons that have a CSS class", function () {
        var container = createTestContainer();
        var buttonName = "buttonName";
        var aButton = new CUORE.Components.Button(buttonName, "CanonicalKey");
        aButton.setContainer(container.id);
        aButton.disable();
        aButton.draw();

        var DOMButton = document.getElementById(aButton.getUniqueID());
        expect(DOMButton.className.indexOf("disabled") > -1).toBeTruthy();

        aButton.enable();
		
        expect(DOMButton.className.indexOf("disabled") > -1).toBeFalsy();
        aButton.disable();
        expect(CUORE.Dom.hasClass(DOMButton, "disabled")).toBeTruthy();
    });

    it("removes the button from the DOM when destroy method is called", function () {
        var container = createTestContainer();
        var buttonName = "buttonName";
        var aButton = new CUORE.Components.Button(buttonName, "CanonicalKey");
        aButton.setContainer(container.id);

        aButton.draw();
        var DOMButton =  document.getElementById(aButton.getUniqueID());
        expect(DOMButton).toBeTruthy();

        aButton.destroy();
        DOMButton =  document.getElementById(aButton.getUniqueID());
        expect(DOMButton).toBeFalsy();
    });

    // Not necessary anymore!
    xit("requests a label when it is drawn", function () {
        var container = createTestContainer();
        var buttonName = "buttonName";
        var aButton = new CUORE.Components.Button(buttonName, "CanonicalKey");

        aButton.setContainer(container.id);

        var getLabelCalled = false;

        aButton.getLabel = function () {
            getLabelCalled = true;
        };

        aButton.draw();

        expect(getLabelCalled).toBeTruthy();
    });

     var createTestContainer = function() {
        var container = document.createElement('div');
        container.id = "testingContainer";
        var panel = document.getElementById("xhtmlToTest");
        panel.appendChild(container);
       
        return container;
    };

});