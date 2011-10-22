describe("Component", function () {

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

    it("execution context initialization needs both service and procedure", function () {
        var aService = "IAmaService";
        var aProcedure = "IAmaProcedure";
        var defaultService = "NULL";
        var defaultProcedure = "nullProcedure";

        var aComponentWithBoth = new CUORE.Component();
        aComponentWithBoth.initializeExecutionContext(aService, aProcedure);

        expect(aService).toEqual(aComponentWithBoth.service);
        expect(aProcedure).toEqual(aComponentWithBoth.procedure);

        var aComponentWithoutOne = new CUORE.Component();
        aComponentWithBoth.initializeExecutionContext(aService);

        expect(aComponentWithoutOne.service).toEqual(defaultService);
        expect(aComponentWithoutOne.procedure).toEqual(defaultProcedure);

        var aComponentWithoutExecutionContext = new CUORE.Component();

        expect(aComponentWithoutExecutionContext.procedure).toEqual(defaultProcedure);
        expect(aComponentWithoutExecutionContext.service).toEqual(defaultService);
    });

    it("could set a Renderer", function () {
        var aComponent = new CUORE.Component();
        var aRenderer = {};
        aRenderer.render = function (component) {};

        spyOn(aRenderer, 'render');

        aComponent.setRenderer(aRenderer);

        aComponent.render();

        expect(aRenderer.render).toHaveBeenCalled();
    });

    it("adds handlers and could dispatch events to the handlers", function () {
        var aHandler = createDummyHandler();

        var eventName = "anEvent";
        var params = {
            aParam: "aparam",
            anotherParam: "anotherParam"
        };

        var aComponent = new CUORE.Component();
        aComponent.addHandler(eventName, aHandler);

        aComponent.eventDispatch(eventName, params);

        expect(aHandler.recievedParams).toEqual(params);
        expect(aHandler.owner.getName()).toEqual(aComponent.getName());
    });

    it("can dispatch events even when it has no handlers", function () {
        var eventName = "anEvent";
        var params = {
            aParam: "aParam",
            anotherParam: "anotherParam"
        };

        var aComponent = new CUORE.Component();
        aComponent.eventDispatch(eventName, params);
        expect(true).toBeTruthy();
    });


    it("knows events managed by handlers", function () {
        var eventName = "anEvent";
        var anotherEvent = "anotherEvent";
        var aComponent = new CUORE.Component();

        aComponent.addHandler(eventName, createDummyHandler());
        aComponent.addHandler(eventName, createDummyHandler());

        var managedEvents = aComponent.getManagedEvents();
        expect(managedEvents).toEqual([eventName]);

        aComponent.addHandler(anotherEvent, createDummyHandler());

        var managedEvents = aComponent.getManagedEvents();
        expect(managedEvents).toEqual([eventName, anotherEvent]);
    });


    it("has a default name or could be explicitly named", function () {
        var aComponent = new CUORE.Component("aService", "aProcedure");

        var componentDefaultName = "aComponent";
        expect(aComponent.getName()).toEqual(componentDefaultName);

        var testingName = "aTestName";
        aComponent.setName(testingName);
        expect(aComponent.getName()).toEqual(testingName);
    });

    it("inject element into its container", function () {
        var container = createTestContainer();
        var componentName = "componentName";

        var aComponent = new CUORE.Component();
        aComponent.setName(componentName);
        aComponent.setContainer(container.id);
        aComponent.draw();
        var id = aComponent.getUniqueID();
        var createdElement = document.getElementById(id);
        
        expect(id).toEqual(componentName + "_inner");
        
        expect(!!(createdElement)).toBeTruthy();
         
        expect(createdElement.tagName).toEqual("DIV"); 
        expect(createdElement.className).toEqual("innerComponentDiv");
        expect(createdElement.parentNode).toBe(container);
    });

    it("could be removed", function () {
        var container = createTestContainer();
        var aComponent = new CUORE.Component();
        aComponent.setContainer(container.id); 
        
        var id = aComponent.getUniqueID();

        aComponent.draw();
        
        aComponent.destroy();
        var createdElement = document.getElementById(id);

        expect(!!(createdElement)).toBeFalsy();
    });

    it("allow adding css classes after drawing", function () {
        var container = createTestContainer();
        var aComponent = new CUORE.Component();
        aComponent.setContainer(container.id);
        var componentId = aComponent.getUniqueID();

        aComponent.addClass("testingClass");
        aComponent.draw();
        
        var element = document.getElementById(componentId);
        
        expect(element.className).toBe("innerComponentDiv testingClass");

        aComponent.addClass("testingClass2");
        expect(element.className).toBe("innerComponentDiv testingClass testingClass2");
    });


    it("allow removing classes after drawing", function () {
        var container = createTestContainer();
        var aComponent = new CUORE.Component();
        aComponent.setContainer(container.id);
        var componentId = aComponent.getUniqueID();
        
        aComponent.addClass("testingClass");
        aComponent.draw();
        
        var element = document.getElementById(componentId);
        
        expect(element.className).toBe("innerComponentDiv testingClass");
        
        aComponent.removeClass("testingClass");
        expect(element.className).toBe("innerComponentDiv");
    });

    it("has I18NKey label getter & setter", function () {
        var aI18Nkey = "CanonicalKey";
        var aComponent = new CUORE.Component();

        aComponent.setI18NKey(aI18Nkey);
        expect(aComponent.getI18NKey(aI18Nkey)).toEqual(aI18Nkey);
    });


    it("requests their label when it is drawn", function () {
        var aService = {};
        var receivedParams = undefined;
        aService.execute = function (procedure, params, flag) {
            receivedParams = params;
        };

        var container = createTestContainer();
        var calledService = null;

        var aComponent = new CUORE.Component();
        var LABELSERVICENAME = 'LABELS';
        aComponent.setContainer(container.id);

        document.page = {};
        document.page.getService = function (anyService) {
            calledService = anyService;
            return aService;
        };


        aComponent.setI18NKey("CanonicalKey");
        aComponent.draw();

        var expectedParams = {
            key: "CanonicalKey"
        };

        expect(receivedParams).toEqual(expectedParams);
        expect(calledService).toEqual(LABELSERVICENAME);
    });

    it("has a Handler for its label when i18nkey setted", function () {
        var eventName = "LABELS_getLabel_EXECUTED_CanonicalKey";
        var aComponent = new CUORE.Component();
        aComponent.setI18NKey("CanonicalKey");

        var events = aComponent.getManagedEvents();
        expect(events).toContain(eventName);
    });

    it("is suscribed to the bus on I18NKey set", function () {
        var receivedSubscriber = undefined;
        var receivedEvent = undefined;
        CUORE.Bus.reset();
        var oldSubscribe = CUORE.Bus.subscribe;
        CUORE.Bus.subscribe = function (subscriber, event) {
            receivedSubscriber = subscriber;
            receivedEvent = event;
        };

        var eventName = "LABELS_getLabel_EXECUTED_CanonicalKey";
        var aComponent = new CUORE.Component();
        aComponent.testFlag = true;
        aComponent.setI18NKey("CanonicalKey");

        expect(aComponent.testFlag).toEqual(receivedSubscriber.testFlag);
        expect(receivedEvent).toEqual(eventName);

        CUORE.Bus.subscribe = oldSubscribe;
    });


    it("does not request its label when drawn if it hasn't a I18Key", function () {
        var aService = {};
        var receivedParams = undefined;
        aService.execute = function (procedure, params, flag) {
            receivedParams = params;
        };

        var container = createTestContainer();
        var calledService = null;

        var aComponent = new CUORE.Component();
        aComponent.setContainer(container.id);

        document.page = {};
        document.page.getService = function (anyService) {
            calledService = anyService;
            return aService;
        };

        aComponent.draw();

        expect(receivedParams).toBeUndefined();
        expect(calledService).toBeNull();
    });


    it("does not request its label when asked (getLabel) if it hasn't a I18Key", function () {
        var aService = {};
        var receivedParams = undefined;
        aService.execute = function (procedure, params, flag) {
            receivedParams = params;
        };

        var container = createTestContainer();
        var calledService = null;

        var aComponent = new CUORE.Component();
        aComponent.getLabelService = function () {
            return aService;
        };

        aComponent.getLabel();

        expect(receivedParams).toBeUndefined();
        expect(calledService).toBeNull();
    });


    it("can draw a text into the page", function () {
        var container = createTestContainer();

        var aComponent = new CUORE.Component();
        aComponent.setContainer(container.id);

        var testText = "testText";
        aComponent.setText(testText);
        aComponent.draw();
        var componentId = aComponent.getUniqueID();
        var createdElement = document.getElementById(componentId);

        expect(aComponent.getText()).toEqual(testText);

        expect(createdElement.innerHTML).toEqual(testText);

        var dummyText = "dummyTextIntoAPage";
        aComponent.setText(dummyText);
        expect(createdElement.innerHTML).toEqual(dummyText);
    });

    it("setting a text doesn't draw", function () {
        var container = createTestContainer();
        var aComponent = new CUORE.Component();
        aComponent.setContainer(container.id);
        var testText = "testText";
        aComponent.setText(testText);
        
        var component = document.getElementById(aComponent.getUniqueID());

        expect(component).toBeNull();
        
    });
    
    it("has a method that retrieves its container", function () {
        var container = createTestContainer();
        var aComponent = new CUORE.Component();
        expect(aComponent.getContainer()).toEqual(document.body);
        aComponent.setContainer(container.id);
        expect(aComponent.getContainer()).toEqual(container);
    });
    
    it("fetch and execute a service from page and execute the procedure when it is executed", function () {

        var procedureName = "aProcedure";
        var serviceName = "aService";
        var testingParams = "testingParams";

        var theService = preparePage(serviceName, procedureName);

        var aComponent = new CUORE.Component();
        aComponent.initializeExecutionContext(serviceName, procedureName);
        aComponent.execute();

        expect(document.page.expectedService).toEqual(serviceName);
        expect(theService.procedureExecuted).toEqual(procedureName);

        aComponent.execute(serviceName, procedureName, testingParams, false);
        expect(theService.paramsExecuted).toEqual(testingParams);

        aComponent.execute(serviceName, procedureName, testingParams, true);
        expect(theService.asynchronousReceived).toBeTruthy();
    });

    it("has enable state", function () {

        var aComponent = new CUORE.Component();
       
        expect(aComponent.isEnabled()).toBeTruthy();
    });

    it("can be disabled", function () {

        var aComponent = new CUORE.Component();
	aComponent.disable();
       
        expect(aComponent.isEnabled()).toBeFalsy();
    });

    it("can be enabled", function () {

        var aComponent = new CUORE.Component();
	aComponent.disable();
	aComponent.enable();
       
        expect(aComponent.isEnabled()).toBeTruthy();
    });

    it("when disabling has disable class", function () {
        var container = createTestContainer();
        var aComponent = new CUORE.Component();
        aComponent.setContainer(container.id);
        var componentId = aComponent.getUniqueID();

        aComponent.disable();
        aComponent.draw();
        
        var element = document.getElementById(componentId);
	var classes = element.className.split(" ");
        
        expect(classes).toContain("disabled");

        aComponent.enable();
	classes = element.className.split(" ");
        expect(classes).not.toContain("disabled");
    });

    var preparePage = function(serviceName, procedureName) {
        document.page = {};

        var aService = prepareService();

        var expectedService = null;
        document.page.getService = function (theService) {
            document.page.expectedService = theService;
            return aService;
        };

        return aService;
    };

    var prepareService = function() {
        var aService = {};

        aService.paramsExecuted = null;
        aService.asynchronousReceived = false;
        aService.procedureExecuted = null;

        aService.execute = function (procedure, params, asynchronous) {
            this.procedureExecuted = procedure;
            this.paramsExecuted = params;
            this.asynchronousReceived = asynchronous;
        };

        return aService;
    }

    var createTestContainer = function() {
        var container = document.createElement('div');
        container.id = "testingContainer";
        var panel = document.getElementById("xhtmlToTest");
        panel.appendChild(container);
       
        return container;
    };

    var createDummyHandler = function() {
        var aHandler = {};
        aHandler.handle = function (params) {
            this.recievedParams = params;
        };
        aHandler.setOwner = function (owner) {
            this.owner = owner;
        };
        return aHandler;
    };

});
