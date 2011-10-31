describe("Component", function() {

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
        var container = document.getElementById('xhtmlToTest');
        container.innerHTML = '';

        xhr.restore();
    });

    xit("execution context initialization needs both service and procedure", function() {
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

    it("could set a Renderer", function() {
        var aComponent = new CUORE.Component();
        var aRenderer = {};
        aRenderer.render = function(component) {};

        spyOn(aRenderer, 'render');

        aComponent.setRenderer(aRenderer);

        aComponent.draw();

        expect(aRenderer.render).toHaveBeenCalled();
    });

    it("can dispatch events even when it has no handlers", function() {
        var eventName = "anEvent";
        var params = {
            aParam: "aParam",
            anotherParam: "anotherParam"
        };

        var aComponent = new CUORE.Component();
        
        expect(function() {
                    aComponent.eventDispatch(eventName, params);
                }).not.toThrow();
    });

    it("has a default name or could be explicitly named", function() {
        var aComponent = new CUORE.Component("aService", "aProcedure");

        var componentDefaultName = "aComponent";
        expect(aComponent.getName()).toEqual(componentDefaultName);

        var testingName = "aTestName";
        aComponent.setName(testingName);
        expect(aComponent.getName()).toEqual(testingName);
    });

    it("inject element into its container", function() {
        var container = createTestContainer();
        var componentName = "componentName";

        var aComponent = new CUORE.Component();
        aComponent.setName(componentName);
        aComponent.setContainer(container.id);
        aComponent.draw();
        var id = aComponent.getUniqueID();
        var createdElement = document.getElementById(id);

        expect(id).toEqual(componentName + "_inner");

        expect( !! (createdElement)).toBeTruthy();

        expect(createdElement.tagName).toEqual("DIV");
        expect(createdElement.className).toEqual("innerComponentDiv");
        expect(createdElement.parentNode).toBe(container);
    });

    it("could be removed", function() {
        var container = createTestContainer();
        var aComponent = new CUORE.Component();
        aComponent.setContainer(container.id);

        var id = aComponent.getUniqueID();

        aComponent.draw();

        aComponent.destroy();
        var createdElement = document.getElementById(id);

        expect( !! (createdElement)).toBeFalsy();
    });

    it("allow adding css classes after drawing", function() {
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


    it("allow removing classes after drawing", function() {
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

    it("can draw a text into the page", function() {
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

    it("setting a text doesn't draw", function() {
        var container = createTestContainer();
        var aComponent = new CUORE.Component();
        aComponent.setContainer(container.id);
        var testText = "testText";
        aComponent.setText(testText);

        var component = document.getElementById(aComponent.getUniqueID());

        expect(component).toBeNull();

    });

    it("has a method that retrieves its container", function() {
        var container = createTestContainer();
        var aComponent = new CUORE.Component();
        expect(aComponent.getContainer()).toEqual(document.body);
        aComponent.setContainer(container.id);
        expect(aComponent.getContainer()).toEqual(container);
    });

    it("has enable state", function() {

        var aComponent = new CUORE.Component();

        expect(aComponent.isEnabled()).toBeTruthy();
    });

    it("can be disabled", function() {

        var aComponent = new CUORE.Component();
        aComponent.disable();

        expect(aComponent.isEnabled()).toBeFalsy();
    });

    it("can be enabled", function() {

        var aComponent = new CUORE.Component();
        aComponent.disable();
        aComponent.enable();

        expect(aComponent.isEnabled()).toBeTruthy();
    });

    it("when disabling has disable class", function() {
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
        document.page.getService = function(theService) {
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

        aService.execute = function(procedure, params, asynchronous) {
            this.procedureExecuted = procedure;
            this.paramsExecuted = params;
            this.asynchronousReceived = asynchronous;
        };

        return aService;
    };

    var createTestContainer = function() {
        var container = document.createElement('div');
        container.id = "testingContainer";
        var panel = document.getElementById("xhtmlToTest");
        panel.appendChild(container);

        return container;
    };

    var createDummyHandler = function() {
        var aHandler = {};
        aHandler.handle = function(params) {
            this.recievedParams = params;
        };
        aHandler.setOwner = function(owner) {
            this.owner = owner;
        };
        return aHandler;
    };
});