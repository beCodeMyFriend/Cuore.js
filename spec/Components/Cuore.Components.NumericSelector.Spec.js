describe("Numeric Selector", function () {

    beforeEach(function(){
        this.addMatchers({
            toBeInstanceOf: CUORE.Matchers.toBeInstanceOf
        });
    });

    afterEach(function(){
        var panel = document.getElementById('xhtmlToTest');
        panel.innerHTML = '';
    });

    it("inherits Component and Input", function () {
        var aNumericSelector = getNumericSelector();

        expect(aNumericSelector).toBeInstanceOf(CUORE.Components.NumericSelector);
        expect(aNumericSelector).toBeInstanceOf(CUORE.Component);
        expect(aNumericSelector).toBeInstanceOf(CUORE.Components.Input);
    });

    it("could be drawn", function () {
        var aNumericSelector = getNumericSelector();
        aNumericSelector.draw();

        var DOMObject = document.getElementById(aNumericSelector.getUniqueID());
        var children = DOMObject.childNodes;
        var span = children[2];
        
        expect(span.className.indexOf('minusButton') > -1).toBeTruthy();

        var inputElement = children[1];
        expect(inputElement.className.indexOf('numericSelector') > -1).toBeTruthy();
        expect(inputElement.value).toEqual(aNumericSelector.limInf + '');
   
        var eventsFocus = CUORE.Dom.Event.hasEvents(inputElement, 'focus'); 
        var eventsBlur = CUORE.Dom.Event.hasEvents(inputElement, 'blur');
        
        expect(eventsBlur).toBeTruthy();
        expect(eventsFocus).toBeTruthy();
    });

    it("has a button to increment", function () {
        var aNumericSelector = getNumericSelector();
        aNumericSelector.draw();

        var DOMObject = document.getElementById(aNumericSelector.getUniqueID());

        var children = DOMObject.childNodes;
        var plusButton = children[2];
        expect(plusButton.tagName).toEqual("A");
        
        var eventsClick = CUORE.Dom.Event.hasEvents(plusButton, 'click'); 
        
        expect(eventsClick).toBeTruthy();
    });

    it("has a button to decrement", function () {
        var aNumericSelector = getNumericSelector();
        aNumericSelector.draw();

        var DOMObject = document.getElementById(aNumericSelector.getUniqueID());
        var children = DOMObject.childNodes;
        var minusButton = children[2];
        var eventsClick = CUORE.Dom.Event.hasEvents(minusButton, 'click');
        
        expect(minusButton.tagName).toEqual("A");
        expect(eventsClick).toBeTruthy();
    });

    it("has the plusbutton on the right", function () {
        var aNumericSelector = getNumericSelector();
        aNumericSelector.draw();

        var DOMObject = document.getElementById(aNumericSelector.getUniqueID());

        var children = DOMObject.getElementsByTagName('A');
        expect(children.length).toEqual(2);
        var minusButton = children[0];
        expect(CUORE.Dom.hasClass(minusButton, 'minusButton')).toBeTruthy();
        var plusButton = children[1];
        expect(CUORE.Dom.hasClass(plusButton, 'plusButton')).toBeTruthy();
    });

    it("allows to get and set its value", function () {
        var aNumericSelector = getNumericSelector();

        aNumericSelector.setValue(2);
        expect(aNumericSelector.getValue()).toEqual(2);

        aNumericSelector.setValue("");
        expect(aNumericSelector.getValue()).toEqual(0);

        aNumericSelector.setValue(3);
        aNumericSelector.draw();
        expect(aNumericSelector.getValue()).toEqual('3');
    });

    it("could have upper and lower limit", function () {
        var aNumericSelector = getNumericSelector();
        aNumericSelector.draw();
        aNumericSelector.setValue(2);

        aNumericSelector.setLimSup(3);
        aNumericSelector.setValue(4);

        expect(aNumericSelector.getValue()).toEqual('3');
        expect(aNumericSelector.getLimSup()).toEqual(3);

        aNumericSelector.setLimInf(2);
        aNumericSelector.setValue(0);

        expect(aNumericSelector.getValue()).toEqual('2');
        expect(aNumericSelector.getLimInf()).toEqual(2);
    });

    it("could have negative limits", function () {
        var aNumericSelector = getNumericSelector();
        aNumericSelector.draw();
        aNumericSelector.setValue(0);

        aNumericSelector.setLimSup(1);
        aNumericSelector.setValue(2);

        expect(aNumericSelector.getValue()).toEqual('1');

        aNumericSelector.setLimInf(-1);
        aNumericSelector.setValue(-2);
        expect(aNumericSelector.getValue()).toEqual('-1');

        aNumericSelector.setValue(0);
        expect(aNumericSelector.getValue()).toEqual('0');
    });

    it("clears value when focus and keeps old value when blur", function () {
        var aNumericSelector = getNumericSelector();
        aNumericSelector.draw();

        var DOMObject = document.getElementById(aNumericSelector.getUniqueID());
        var children = DOMObject.childNodes;
        var theInput = children[1];

        CUORE.Dom.Event.fire(theInput, 'focus');
        expect(theInput.value).toEqual("");
        CUORE.Dom.Event.fire(theInput, 'blur');

        CUORE.Dom.Event.fire(theInput, 'focus');
        theInput.value = 2;
        CUORE.Dom.Event.fire(theInput, 'blur'); 
        expect(aNumericSelector.getValue()).toEqual('2');

        CUORE.Dom.Event.fire(theInput, 'focus');
        theInput.value = '';
        CUORE.Dom.Event.fire(theInput, 'blur'); 
        expect(aNumericSelector.getValue()).toEqual('2');
        
        CUORE.Dom.Event.fire(theInput, 'focus');
        theInput.value = 'we34';
        CUORE.Dom.Event.fire(theInput, 'blur'); 
        expect(aNumericSelector.getValue()).toEqual('2');
        
        CUORE.Dom.Event.fire(theInput, 'focus');
        theInput.value = '2.5';
        CUORE.Dom.Event.fire(theInput, 'blur'); 
        expect(aNumericSelector.getValue()).toEqual('2');
    });

    it("has increment and decrement buttons that could be clicked", function () {
        var aNumericSelector = getNumericSelector();
        aNumericSelector.draw();

        var DOMObject = document.getElementById(aNumericSelector.getUniqueID());
        var children = DOMObject.getElementsByTagName('A');

        var value = aNumericSelector.getValue();
        var incrementer = 4;
        aNumericSelector.setIncrementer(incrementer);
        var plusButton = children[1];
        CUORE.Dom.Event.fire(plusButton, 'click');
        
        var expected = (parseInt(value) + incrementer).toString();

        expect(aNumericSelector.getValue()).toEqual(expected);

        var value = aNumericSelector.getValue();
        var minusButton = children[0];
        var incrementer = 2;
        aNumericSelector.setIncrementer(incrementer);
        CUORE.Dom.Event.fire(minusButton, 'click'); 
        expected = (value - incrementer).toString();

        expect(aNumericSelector.getValue()).toEqual(expected);
    });

    it("emits event when the value is changed", function () {
        var bus = {};

        var numericSelectorEvent = "";
        var numericSelectorParams = undefined;

        bus.emit = function (event, params) {
            numericSelectorEvent = event;
            numericSelectorParams = params;
        };

        var aNumericSelector = getNumericSelector();
        aNumericSelector.getBus = function () {
            return bus;
        };

        aNumericSelector.draw();
        var expectedValue = 3;
        aNumericSelector.setValue(expectedValue);

        var expectedParams = {
            "value": expectedValue
        };
        var expectedEvent = "COMPONENT_" + aNumericSelector.name + "_CHANGED";

        expect(expectedParams).toEqual(numericSelectorParams);
        expect(expectedEvent).toEqual(numericSelectorEvent);
    });

    it("allows to decorate the buttons ", function () {
        var aNumericSelector = getNumericSelector();
        aNumericSelector.draw();

        var DOMObject = document.getElementById(aNumericSelector.getUniqueID());
        var plusButton = DOMObject.getElementsByTagName('A')[1];
        aNumericSelector.setLimSup(3);

        aNumericSelector.setValue(3);
        expect(CUORE.Dom.hasClass(plusButton, 'off')).toBeTruthy();

        aNumericSelector.setValue(2);
        expect(CUORE.Dom.hasClass(plusButton, 'off')).toBeFalsy();

        var minusButton = DOMObject.getElementsByTagName('A')[0];
        aNumericSelector.setLimInf(0);

        aNumericSelector.setValue(0);
        expect(CUORE.Dom.hasClass(minusButton, 'off')).toBeTruthy();

        aNumericSelector.setValue(2);
        expect(CUORE.Dom.hasClass(minusButton, 'off')).toBeFalsy();
    });

    it("change buttons decoration when limits are reached", function () {
        var aNumericSelector = getNumericSelector();
        aNumericSelector.draw();
        aNumericSelector.setIncrementer(2);

        var DOMObject = document.getElementById(aNumericSelector.getUniqueID());
        var plusButton = DOMObject.getElementsByTagName('A')[1];
        aNumericSelector.setLimSup(3);
        aNumericSelector.setValue(2);
        expect(CUORE.Dom.hasClass(plusButton, 'off')).toBeTruthy();

        aNumericSelector.setValue(0);
        expect(CUORE.Dom.hasClass(plusButton, 'off')).toBeFalsy();

        var minusButton = DOMObject.getElementsByTagName('A')[0];
        aNumericSelector.setLimInf(-3);

        aNumericSelector.setValue(-2);
        expect(CUORE.Dom.hasClass(minusButton, 'off')).toBeTruthy();

        aNumericSelector.setValue(0);
        expect(CUORE.Dom.hasClass(minusButton, 'off')).toBeFalsy();
        aNumericSelector.setValue(3);
        expect(aNumericSelector.getValue()).toEqual('2');
        aNumericSelector.setValue(-3);
        expect(aNumericSelector.getValue()).toEqual('-2');
    });

     it("disable buttons when disabled ", function () {
        var aNumericSelector = getNumericSelector();
        aNumericSelector.disable();
        aNumericSelector.draw();
        
        var DOMObject = document.getElementById(aNumericSelector.getUniqueID());
        var plusButton = DOMObject.getElementsByTagName('A')[1];
        expect(CUORE.Dom.hasClass(plusButton, 'off')).toBeTruthy();
        var minusButton = DOMObject.getElementsByTagName('A')[0];
        expect(CUORE.Dom.hasClass(minusButton, 'off')).toBeTruthy();

    });

    it("disallows increments and decrements when disabled ", function () {
        var aNumericSelector = getNumericSelector();
        aNumericSelector.disable();
        var control=5;
        aNumericSelector.setValue(control);
        
        aNumericSelector.minus();
        
        expect(aNumericSelector.getValue()).toEqual(control);
        
        aNumericSelector.plus();
        
        expect(aNumericSelector.getValue()).toEqual(control);

    });
    
    var getNumericSelector = function() {
        var aNumericSelector = new CUORE.Components.NumericSelector();
        aNumericSelector.setContainer('xhtmlToTest');
        return aNumericSelector;
    };
});