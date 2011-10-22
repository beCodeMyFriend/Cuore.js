describe("Page", function () {

    it("initialization calls initializeServices", function () {
        var aPage = new CUORE.Page();
        var initializeServicesCalled = false;

        aPage.initializeServices = function () {
            initializeServicesCalled = true;
        };

        aPage.init();

        expect(initializeServicesCalled).toBeTruthy();
    });

    it("initialization calls initializeComponents", function () {
        var aPage = new CUORE.Page();
        var initializeComponentsCalled = false;

        aPage.initializeComponents = function () {
            initializeComponentsCalled = true;
        };

        aPage.init();

        expect(initializeComponentsCalled).toBeTruthy();
    });

    it("can add and fecth services", function () {
        var aPage = new CUORE.Page();
        var abstractServiceName = "ABSTRACT";
        var aService = aPage.getService(abstractServiceName);
        expect(aService instanceof CUORE.Services.Null).toBeTruthy();

        aService = aPage.getService(null);
        expect(aService instanceof CUORE.Services.Null).toBeTruthy();

        aService = aPage.getService(undefined);
        expect(aService instanceof CUORE.Services.Null).toBeTruthy();

        aService = {};
        aService.getName = function () {
            return abstractServiceName;
        };
        aService.setBaseURL = function (baseURL) {};
        aPage.addService(aService);

        var serviceRetrieved = aPage.getService(abstractServiceName);
        expect(serviceRetrieved.getName()).toEqual(abstractServiceName);
    });

    it("initialization creates a Labelservice ", function () {
        var aPage = new CUORE.Page();
        var serviceName = "LABELS";
        var aService = aPage.getService(serviceName);
        expect(aService instanceof CUORE.Services.Label).toBeTruthy();

    });

    it("creates a button service at initialization", function () {
        var aPage = new CUORE.Page();
        var serviceName = "BUTTON";
        var aService = aPage.getService(serviceName);
        expect(aService instanceof CUORE.Services.Button).toBeTruthy();

    });
    
    it("allows baseUrl initialization", function () {
        var aPage = new CUORE.Page();
        expect(aPage.getBaseURL()).toEqual("");

        aPage = new CUORE.Page("A Base URL");
        expect(aPage.getBaseURL()).toEqual("A Base URL");
    });

    it("sets baseURL to the services", function () {
        var aBaseURL = "a base URL";
        var aPage = new CUORE.Page(aBaseURL);
        var baseURLSet = "";
        var aService = {};
        aService.setBaseURL = function (baseURL) {
            baseURLSet = baseURL;
        };
        aService.getName = function () {};
        aPage.addService(aService);
        expect(baseURLSet).toEqual(aBaseURL);
    });

    it("allow component registration", function () {
        var aPage = new CUORE.Page();

        var aComponent = createDummyComponent();
        var anotherComponent = createDummyComponent(); 

        var testingContainer = "testingContainer";

        aPage.addComponent(aComponent, testingContainer);
        aPage.addComponent(anotherComponent, testingContainer);
        var componentName = aComponent.setNameCalled;
        var anotherComponentName = anotherComponent.setNameCalled;

        expect(anotherComponentName).not.toEqual(componentName);
    });

    it("draw components when it is drawn", function () {
        var aPage = new CUORE.Page();
        var aComponent = createDummyComponent();
        var anotherComponent = createDummyComponent();

        var testingContainer = "testingContainer";

        aPage.addComponent(aComponent, testingContainer);
        aPage.addComponent(anotherComponent, testingContainer);

        aPage.draw();

        expect(aComponent.drawCalled).toBeTruthy();
        expect(anotherComponent.drawCalled).toBeTruthy();
    });


    it("drawing can replace container when asked", function () {
        var container = document.createElement('div');
        container.id = "testingContainer";
        var panel = document.getElementById("xhtmlToTest");
        panel.appendChild(container);
        var containerHtml = "Lorem ipsum";
        container.innerHTML = containerHtml;

        var aPage = new CUORE.Page();
        aPage.addComponent(createDummyComponent(), container);
        aPage.draw();
        expect(container.innerHTML).toEqual(containerHtml);

        aPage.addComponent(createDummyComponent(), container, false);
        aPage.draw();
        expect(container.innerHTML).toEqual(containerHtml);

        aPage.addComponent(createDummyComponent(), container, true);
        aPage.draw();
        expect(container.innerHTML).toEqual("");
    });

    it("subscribes components to the bus", function () {
        var aComponent = createDummyComponent();
        var aBus = CUORE.Bus;
        aBus.reset();

        var aPage = new CUORE.Page();
        aPage.addComponent(aComponent, "anyContainer");

        expect(aBus.subscribers("testEvent")).toContain(aComponent);
        expect(aBus.subscribers("dummyEvent")).toContain(aComponent);
    });

    var createDummyComponent = function() {
        var aComponent = {};

        aComponent.setNameCalled = null;
        aComponent.drawCalled = false;
        aComponent.container = null;
        aComponent.getManagedEvents = function () {
            return ["testEvent", "dummyEvent"];
        };
        aComponent.getTypeName = function () {
            return "dummy";
        };
        aComponent.setName = function (name) {
            this.setNameCalled = name;
        };
        aComponent.getName = function () {
            return this.setNameCalled;
        };
        aComponent.setContainer = function (aContainer) {
            this.container = aContainer;
        };
        aComponent.getContainer = function () {
            return this.container;
        };
        aComponent.draw = function () {
            this.drawCalled = true;
        };

        return aComponent;
    };
});