describe("Numeric Selector", function() {

    it("inherits Component and Input", function() {
        var aNumericSelector = getNumericSelector();

        expect(aNumericSelector instanceof CUORE.Components.NumericSelector).toBeTruthy();
        expect(aNumericSelector instanceof CUORE.Component).toBeTruthy();
        expect(aNumericSelector instanceof CUORE.Components.Input).toBeTruthy();
    });

    it("allows to get and set its value", function() {
        var aNumericSelector = getNumericSelector();

        aNumericSelector.setValue(2);
        expect(aNumericSelector.getValue()).toEqual(2);

        aNumericSelector.setValue("");
        expect(aNumericSelector.getValue()).toEqual(0);

        aNumericSelector.setValue(3);
        aNumericSelector.draw();
        expect(aNumericSelector.getValue()).toEqual('3');
    });

    it("could have upper and lower limit", function() {
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

    it("could have negative limits", function() {
        var aNumericSelector = getNumericSelector();
        aNumericSelector.setValue(0);

        aNumericSelector.setLimSup(1);
        aNumericSelector.setValue(2);

        expect(aNumericSelector.getValue()).toEqual(1);

        aNumericSelector.setLimInf(-1);
        aNumericSelector.setValue(-2);
        expect(aNumericSelector.getValue()).toEqual(-1);

        aNumericSelector.setValue(0);
        expect(aNumericSelector.getValue()).toEqual(0);
    });

    it("emits event when the value is changed", function() {
        var bus = {};

        var numericSelectorEvent = "";
        var numericSelectorParams = undefined;

        bus.emit = function(event, params) {
            numericSelectorEvent = event;
            numericSelectorParams = params;
        };

        var aNumericSelector = getNumericSelector();
        aNumericSelector.getBus = function() {
            return bus;
        };

        var expectedValue = 3;
        aNumericSelector.setValue(expectedValue);

        var expectedParams = {
            "value": expectedValue
        };
        var expectedEvent = "COMPONENT_" + aNumericSelector.name + "_CHANGED";

        expect(expectedParams).toEqual(numericSelectorParams);
        expect(expectedEvent).toEqual(numericSelectorEvent);
    });

    it("disallows increments and decrements when disabled ", function() {
        var aNumericSelector = getNumericSelector();
        aNumericSelector.disable();
        var control = 5;
        aNumericSelector.setValue(control);

        aNumericSelector.minus();

        expect(aNumericSelector.getValue()).toEqual(control);

        aNumericSelector.plus();

        expect(aNumericSelector.getValue()).toEqual(control);

    });

    describe('renderer', function() {
        var aNumericSelector;
        var aRenderer;

        beforeEach(function() {
            var container = createTestContainer();
            aNumericSelector = createDummyComponent();
            aRenderer = new CUORE.Renderers.NumericSelector();
            aRenderer.setContainer(container.id);
        });

        afterEach(function() {
            var panel = document.getElementById('xhtmlToTest');
            panel.innerHTML = '';
        });

        it("could be drawn", function() {
            aRenderer.render(aNumericSelector);

            var DOMObject = document.getElementById(aRenderer.htmlID);
            var children = DOMObject.childNodes;
            var span = children[2];
            expect(span.className.indexOf('minusButton') > -1).toBeTruthy();

            var inputElement = children[1];
            expect(inputElement.className.indexOf('numericSelector') > -1).toBeTruthy();

            var eventsFocus = CUORE.Dom.Event.hasEvents(inputElement, 'focus');
            var eventsBlur = CUORE.Dom.Event.hasEvents(inputElement, 'blur');

            expect(eventsBlur).toBeTruthy();
            expect(eventsFocus).toBeTruthy();
        });

        it("has a button to increment", function() {
            aRenderer.render(aNumericSelector);

            var DOMObject = document.getElementById(aRenderer.htmlID);

            var children = DOMObject.childNodes;
            var plusButton = children[2];
            expect(plusButton.tagName).toEqual("A");

            var eventsClick = CUORE.Dom.Event.hasEvents(plusButton, 'click');

            expect(eventsClick).toBeTruthy();
        });


        it("has a button to decrement", function() {
            aRenderer.render(aNumericSelector);

            var DOMObject = document.getElementById(aRenderer.htmlID);
            var children = DOMObject.childNodes;
            var minusButton = children[2];
            var eventsClick = CUORE.Dom.Event.hasEvents(minusButton, 'click');

            expect(minusButton.tagName).toEqual("A");
            expect(eventsClick).toBeTruthy();
        });


        it("has the plusbutton on the right", function() {
            aRenderer.render(aNumericSelector);

            var DOMObject = document.getElementById(aRenderer.htmlID);

            var children = DOMObject.getElementsByTagName('A');
            expect(children.length).toEqual(2);
            var minusButton = children[0];
            expect(CUORE.Dom.hasClass(minusButton, 'minusButton')).toBeTruthy();
            var plusButton = children[1];
            expect(CUORE.Dom.hasClass(plusButton, 'plusButton')).toBeTruthy();
        });

        it("clears value when focus and keeps old value when blur", function() {
            aRenderer.render(aNumericSelector);

            var DOMObject = document.getElementById(aRenderer.htmlID);
            var children = DOMObject.childNodes;
            var theInput = children[1];

            CUORE.Dom.Event.fire(theInput, 'focus');
            expect(theInput.value).toEqual("");
            CUORE.Dom.Event.fire(theInput, 'blur');

            CUORE.Dom.Event.fire(theInput, 'focus');
            theInput.value = 2;
            CUORE.Dom.Event.fire(theInput, 'blur');
            expect(theInput.value).toEqual('2');

            CUORE.Dom.Event.fire(theInput, 'focus');
            theInput.value = '';
            CUORE.Dom.Event.fire(theInput, 'blur');
            expect(theInput.value).toEqual('2');

            CUORE.Dom.Event.fire(theInput, 'focus');
            theInput.value = 'we34';
            CUORE.Dom.Event.fire(theInput, 'blur');
            expect(theInput.value).toEqual('2');

            CUORE.Dom.Event.fire(theInput, 'focus');
            theInput.value = '2.5';
            CUORE.Dom.Event.fire(theInput, 'blur');
            expect(theInput.value).toEqual('2');
        });

        it("has increment and decrement buttons that could be clicked", function() {
            aRenderer.render(aNumericSelector);

            var DOMObject = document.getElementById(aRenderer.htmlID);
            var children = DOMObject.getElementsByTagName('A');

            var plusButton = children[1];
            CUORE.Dom.Event.fire(plusButton, 'click');
            expect(aNumericSelector.plus).toHaveBeenCalled();


            var minusButton = children[0];
            CUORE.Dom.Event.fire(minusButton, 'click');
            expect(aNumericSelector.minus).toHaveBeenCalled();

        });

        it("allows to decorate the buttons ", function() {
            aRenderer.render(aNumericSelector);

            var DOMObject = document.getElementById(aRenderer.htmlID);
            var plusButton = DOMObject.getElementsByTagName('A')[1];
            aNumericSelector.limSup = 3;

            aNumericSelector.value = 3;
            aRenderer.update(aNumericSelector);
            expect(CUORE.Dom.hasClass(plusButton, 'off')).toBeTruthy();

            aNumericSelector.value = 2;
            aRenderer.update(aNumericSelector);
            expect(CUORE.Dom.hasClass(plusButton, 'off')).toBeFalsy();

            var minusButton = DOMObject.getElementsByTagName('A')[0];
            aRenderer.update(aNumericSelector);
            aNumericSelector.limInf = 0;

            aNumericSelector.value = 0;
            aRenderer.update(aNumericSelector);
            expect(CUORE.Dom.hasClass(minusButton, 'off')).toBeTruthy();

            aNumericSelector.value = 2;
            aRenderer.update(aNumericSelector);
            expect(CUORE.Dom.hasClass(minusButton, 'off')).toBeFalsy();
        });

        it("change buttons decoration when limits are reached", function() {
            aRenderer.render(aNumericSelector);

            aNumericSelector.incrementer = 2;

            var DOMObject = document.getElementById(aRenderer.htmlID);
            var plusButton = DOMObject.getElementsByTagName('A')[1];
            var input = DOMObject.getElementsByTagName('INPUT')[0];

            aNumericSelector.limSup = 3;
            aNumericSelector.value = 2;
            aRenderer.update(aNumericSelector);
            expect(CUORE.Dom.hasClass(plusButton, 'off')).toBeTruthy();


            aNumericSelector.value = 0;
            aRenderer.update(aNumericSelector);
            expect(CUORE.Dom.hasClass(plusButton, 'off')).toBeFalsy();

            var minusButton = DOMObject.getElementsByTagName('A')[0];
            aNumericSelector.limInf = -3;

            aNumericSelector.value = -2;
            aRenderer.update(aNumericSelector);
            expect(CUORE.Dom.hasClass(minusButton, 'off')).toBeTruthy();

            aNumericSelector.value = 0;
            aRenderer.update(aNumericSelector);
            expect(CUORE.Dom.hasClass(minusButton, 'off')).toBeFalsy();
        });

        it("disable buttons when disabled ", function() {
            aNumericSelector.isEnabled = jasmine.createSpy('isEnabled').andReturn(false);

            aRenderer.render(aNumericSelector);

            var DOMObject = document.getElementById(aRenderer.htmlID);
            var plusButton = DOMObject.getElementsByTagName('A')[1];
            expect(CUORE.Dom.hasClass(plusButton, 'off')).toBeTruthy();
            var minusButton = DOMObject.getElementsByTagName('A')[0];
            expect(CUORE.Dom.hasClass(minusButton, 'off')).toBeTruthy();
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

                aComponent.limSup = 999999999999999999999999;
                aComponent.limInf = 0;
                aComponent.incrementer = 1;
                aComponent.type = "text";
                aComponent.getInputText = jasmine.createSpy('getInputText').andReturn('the input text');
                aComponent.getFormName = jasmine.createSpy('getFormName').andReturn('the form name');
                aComponent.minus = jasmine.createSpy('minus');
                aComponent.plus = jasmine.createSpy('plus');

                return aComponent;
            }
    });

    var getNumericSelector = function() {
            var aNumericSelector = new CUORE.Components.NumericSelector();
            aNumericSelector.setContainer('xhtmlToTest');
            return aNumericSelector;
        };
});