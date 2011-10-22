describe("TimeRange", function () {

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
        var theComponent = getTimeRange();
        expect(theComponent instanceof CUORE.Component).toBeTruthy();
        expect(theComponent instanceof CUORE.Components.TimeRange).toBeTruthy();
    });

    it("could be Instanced with I18N", function () {
        var theComponent = new CUORE.Components.TimeRange("aKey");
        expect(theComponent.getI18NKey()).toEqual("aKey");
    });

    it("should draw selects", function () {
        var theComponent = getTimeRange();
        var aText = "aText";
        theComponent.setText("anotherText");
        theComponent.draw();
        theComponent.setText(aText);
        DOMObject = document.getElementById(theComponent.getUniqueID());
        expect(DOMObject.innerHTML.indexOf("anotherText")).toEqual(-1);
        expect(CUORE.Dom.hasClass(DOMObject, "timeRange")).toBeTruthy();

        var label = DOMObject.getElementsByTagName("label")[0];
        expect(!!label).toBeTruthy();
        expect(label.innerHTML).toEqual(aText);

        var startHourSelect = DOMObject.childNodes[1];
        expect(!!startHourSelect).toBeTruthy();

        var endHourSelect = DOMObject.childNodes[2];
        expect(!!endHourSelect).toBeTruthy();
    });

    it("should draw default values", function () {
        var theComponent = getTimeRange();
        theComponent.draw();
        DOMObject = document.getElementById(theComponent.getUniqueID());
            
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

    it("should draw end options depending on start hour", function () {
        var theComponent = getTimeRange();
        theComponent.draw();
        DOMObject = document.getElementById(theComponent.getUniqueID());
        var endHour = "07:00";
        theComponent.setEndHour(endHour);

        var startHour = "03:00";
        theComponent.setStartHour(startHour);

        var endHourSelect = DOMObject.childNodes[2];
        var options = endHourSelect.options;
        expect(options[0].value).toEqual("04:00");

        var startHourSelect = DOMObject.childNodes[1];
        var selectedHour = startHourSelect.options[startHourSelect.selectedIndex].value;
        expect(selectedHour).toEqual(startHour);
        selectedHour = endHourSelect.options[endHourSelect.selectedIndex].value;
        expect(selectedHour).toEqual(endHour);
    });

    it("should draw start options depending on end hour", function () {
        var theComponent = getTimeRange();
        theComponent.draw();
        var DOMObject = document.getElementById(theComponent.getUniqueID());
        var startHour = "04:00";
        theComponent.setStartHour(startHour);

        var endHour = "20:00";
        theComponent.setEndHour(endHour);

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

    it("should draw select options depending each other", function () {
        var theComponent = getTimeRange();
        theComponent.draw();
        var DOMObject = document.getElementById(theComponent.getUniqueID());

        var startSelect =  DOMObject.childNodes[1];
        var endSelect =  DOMObject.childNodes[2];

        startSelect.selectedIndex = 9;
        CUORE.Dom.Event.fire(startSelect, 'change');
        expect(theComponent.getStartHour()).toEqual("09:00");

        endSelect.selectedIndex = 2;
        
        CUORE.Dom.Event.fire(endSelect, 'change');
        expect(theComponent.getEndHour()).toEqual('12:00');
    });

    it("should call service on change", function () {
        var theComponent = getTimeRange();

        var emitedEvent = null;
        var emitedParams = null;

        var bus = {};
        bus.emit = function (event, params) {
            emitedEvent = event;
            emitedParams = params;
        };

        theComponent.getBus = function () {
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

    it("should allow to set and get the values", function () {
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

    it("should allow to specify granularity in 15 minutes or 30 minutes ", function () {
        var theComponent = getTimeRange(15);
        theComponent.draw();
        DOMObject = document.getElementById(theComponent.getUniqueID());

        var startSelectOptions = DOMObject.childNodes[1].options;
        expect(startSelectOptions[1].innerHTML).toEqual("00:15");
        expect(startSelectOptions[4].innerHTML).toEqual("01:00");
    });

    it("when disabling has disable class", function () {
        
        var aComponent = getTimeRange();
        
        var componentId = aComponent.getUniqueID();

        aComponent.disable();
        aComponent.draw();
        
        var element = document.getElementById(componentId);
        
        expect(CUORE.Dom.hasClass(element, "disabled")).toBeTruthy();
        aComponent.enable();
        expect(CUORE.Dom.hasClass(element, "disabled")).toBeFalsy();
        
    });
    
    
    it("when disabling has disabled selects", function () {
        
        var aComponent = getTimeRange();
        
        var componentId = aComponent.getUniqueID();

        aComponent.disable();
        aComponent.draw();
        
        var element = document.getElementById(componentId);
        
        var startSelect =  element.childNodes[1];
        var endSelect =  element.childNodes[2];
       
        
        
        expect(startSelect.disabled).toBeTruthy();
        expect(endSelect.disabled).toBeTruthy();
        
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