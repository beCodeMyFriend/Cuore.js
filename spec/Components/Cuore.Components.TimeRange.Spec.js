describe("TimeRange", function() {

    it("inherits Component", function() {
        var theComponent = getTimeRange();
        expect(theComponent instanceof CUORE.Component).toBeTruthy();
        expect(theComponent instanceof CUORE.Components.TimeRange).toBeTruthy();
    });

    it("could be Instanced with I18N", function() {
        var theComponent = new CUORE.Components.TimeRange("aKey");
        expect(theComponent.getLabelText()).toEqual("aKey");
    });

    it("should call service on change", function() {
        var theComponent = getTimeRange();

        var emitedEvent = null;
        var emitedParams = null;

        var bus = {};
        bus.emit = function(event, params) {
            emitedEvent = event;
            emitedParams = params;
        };

        theComponent.getBus = function() {
            return bus;
        };

        var expectedValue = "03:00";
        theComponent.setStartHour(expectedValue);

        var expectedParams = {
            "startHour": "03:00",
            "endHour": "24:00"
        };
        var expectedEvent = "COMPONENT_" + theComponent.name + "_CHANGED";

        expect(expectedParams).toEqual(emitedParams);
        expect(expectedEvent).toEqual(emitedEvent);

        var expectedValue = "08:00";
        theComponent.setEndHour(expectedValue);

        var expectedParams = {
            "startHour": "03:00",
            "endHour": "08:00"
        };
        var expectedEvent = "COMPONENT_" + theComponent.name + "_CHANGED";

        expect(expectedParams).toEqual(emitedParams);
        expect(expectedEvent).toEqual(emitedEvent);
    });

    it("should allow to set and get the values", function() {
        var theComponent = getTimeRange();

        theComponent.setStartHour("4:00");
        expect(theComponent.getStartHour()).toEqual("04:00");

        theComponent.setEndHour(8);
        expect(theComponent.getEndHour()).toEqual("08:00");

        theComponent.setStartHour(1);
        theComponent.setEndHour(3);
        theComponent.setStartHour(4);
        expect(theComponent.getStartHour()).toEqual("02:00");

        theComponent.setEndHour(7);
        theComponent.setStartHour(4);
        theComponent.setEndHour(3);
        expect(theComponent.getEndHour()).toEqual("05:00");
    });

    it("should allow to specify granularity in 15 minutes or 30 minutes ", function() {
        var theComponent = getTimeRange(15);

        expect(theComponent.journey.granularity()).toEqual(15);
    });

    describe('renderer', function() {

        var theComponent;
        var aRenderer;

        beforeEach(function() {
            var container = createTestContainer();
            theComponent = createDummyComponent();
            aRenderer = new CUORE.Renderers.TimeRange();
            aRenderer.setContainer(container.id);
        });

        afterEach(function() {
            var container = document.getElementById('xhtmlToTest');
            container.innerHTML = '';
        });

        it("should draw selects", function() {
            var aText = "aText";
            theComponent.getLabelText = jasmine.createSpy('getLabelText').andReturn(aText);
            aRenderer.render(theComponent);

            DOMObject = document.getElementById(aRenderer.htmlID);
            expect(DOMObject.innerHTML.indexOf("anotherText")).toEqual(-1);
            expect(CUORE.Dom.hasClass(DOMObject, "timeRange")).toBeTruthy();

            var label = DOMObject.getElementsByTagName("label")[0];
            expect( !! label).toBeTruthy();
            expect(label.innerHTML).toEqual(aText);

            var startHourSelect = DOMObject.childNodes[1];
            expect( !! startHourSelect).toBeTruthy();

            var endHourSelect = DOMObject.childNodes[2];
            expect( !! endHourSelect).toBeTruthy();
        });

        it("should draw default values", function() {
            aRenderer.render(theComponent);
            DOMObject = document.getElementById(aRenderer.htmlID);

            var startHourSelect = DOMObject.childNodes[1];
            var startSelectOptions = startHourSelect.options;

            expect(startSelectOptions[0].value).toEqual("00:00");
            expect(startSelectOptions[0].innerHTML).toEqual("00:00");
            expect(startSelectOptions[23].value).toEqual("23:00");
            expect(startSelectOptions[23].innerHTML).toEqual("23:00");
            expect(startSelectOptions.length, 24, "Amount of options");
            var selectedHour = startSelectOptions[startHourSelect.selectedIndex].value;
            expect(selectedHour).toEqual("00:00");

            var endHourSelect = DOMObject.childNodes[2];
            var endSelectOptions = endHourSelect.options;
            expect(endSelectOptions[0].value).toEqual("01:00");
            expect(endSelectOptions[0].innerHTML).toEqual("01:00");
            expect(endSelectOptions[23].value).toEqual("24:00");
            expect(endSelectOptions[23].innerHTML).toEqual("24:00");
            expect(endSelectOptions.length, 24, "Amount of options");
            var selectedHour = endSelectOptions[endHourSelect.selectedIndex].value;
            expect(selectedHour).toEqual("24:00");
        });

        it("should draw end options depending on start hour", function() {
            aRenderer.render(theComponent);

            var endHour = "07:00";
            var startHour = "03:00";
            theComponent.journey.ends = jasmine.createSpy('journey.ends').andReturn(endHour);
            theComponent.journey.starts = jasmine.createSpy('journey.starts').andReturn(startHour);
            aRenderer.update(theComponent);

            DOMObject = document.getElementById(aRenderer.htmlID);

            var endHourSelect = DOMObject.childNodes[2];
            var options = endHourSelect.options;
            expect(options[0].value).toEqual("04:00");

            var startHourSelect = DOMObject.childNodes[1];
            var selectedHour = startHourSelect.options[startHourSelect.selectedIndex].value;
            expect(selectedHour).toEqual(startHour);
            selectedHour = endHourSelect.options[endHourSelect.selectedIndex].value;
            expect(selectedHour).toEqual(endHour);
        });

        it("should draw start options depending on end hour", function() {
            aRenderer.render(theComponent);

            var endHour = "20:00";
            var startHour = "04:00";
            theComponent.journey.ends = jasmine.createSpy('journey.ends').andReturn(endHour);
            theComponent.journey.starts = jasmine.createSpy('journey.starts').andReturn(startHour);
            aRenderer.update(theComponent);

            DOMObject = document.getElementById(aRenderer.htmlID);

            var startHourSelect = DOMObject.childNodes[1];
            var options = startHourSelect.options;
            var lastOption = (options.length - 1);
            expect(options[lastOption].value).toEqual("19:00");

            var endHourSelect = DOMObject.childNodes[2];
            var selectedHour = endHourSelect.options[endHourSelect.selectedIndex].value;
            expect(selectedHour).toEqual(endHour);
            selectedHour = startHourSelect.options[startHourSelect.selectedIndex].value;

            expect(selectedHour).toEqual(startHour);
        });

        it("should draw select options depending each other", function() {
            theComponent.setStartHour = jasmine.createSpy('setStartHour');
            theComponent.setEndHour = jasmine.createSpy('setEndHour');
            aRenderer.render(theComponent);

            var DOMObject = document.getElementById(aRenderer.htmlID);

            var startSelect = DOMObject.childNodes[1];
            var endSelect = DOMObject.childNodes[2];

            CUORE.Dom.Event.fire(startSelect, 'change');
            expect(theComponent.setStartHour).toHaveBeenCalled();

            CUORE.Dom.Event.fire(endSelect, 'change');
            expect(theComponent.setEndHour).toHaveBeenCalled();
        });

        it("when disabling has disable class", function() {
            theComponent.isEnabled = jasmine.createSpy('isEnabled').andReturn(false);
            aRenderer.render(theComponent);

            var element = document.getElementById(aRenderer.htmlID);

            expect(CUORE.Dom.hasClass(element, "disabled")).toBeTruthy();

            theComponent.isEnabled = jasmine.createSpy('isEnabled').andReturn(true);
            aRenderer.update(theComponent);
            expect(CUORE.Dom.hasClass(element, "disabled")).toBeFalsy();
        });

        it("when disabling has disabled selects", function() {
            theComponent.isEnabled = jasmine.createSpy('isEnabled').andReturn(false);
            aRenderer.render(theComponent);

            var element = document.getElementById(aRenderer.htmlID);

            var startSelect = element.childNodes[1];
            var endSelect = element.childNodes[2];

            expect(startSelect.disabled).toBeTruthy();
            expect(endSelect.disabled).toBeTruthy();
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
                aComponent.getLabelText = jasmine.createSpy('getLabelText');
                aComponent.getLabelText = jasmine.createSpy('getLabelText');

                var aJourney = new CUORE.Journey();
                aComponent.journey = aJourney

                return aComponent;
            }
    });

    var getTimeRange = function(granularity) {
            var key = "aKey";
            var aComponent = new CUORE.Components.TimeRange(key);
            if (granularity) {
                var aComponent = new CUORE.Components.TimeRange(key, granularity);
            }
            aComponent.setContainer("xhtmlToTest");
            return aComponent;
        };
});