describe("Page", function () {
    var aPage, registry, directory;

    var mock = function(name, methodNames) {
      var r = {'_description':name}
          , numberOfMethods = methodNames.length
          , methodName;
      for(var i = 0; i < numberOfMethods; i++) {
        methodName = methodNames[i];
        r[methodName] = jasmine.createSpy(name + "." + methodName);
      }
      return r;
    };

    var mockRegistry=function() {
        return mock('registry', ['register', 'size', 'each']);
    };

    var mockDirectory=function() {
        return mock('directory', ['add', 'list', 'execute', 'getService']);
    };

    beforeEach(function() {
        aPage = new CUORE.Page();
        registry = mockRegistry();
        directory = mockDirectory();
        aPage.setDirectory(directory);
        aPage.setRegistry(registry);
    });

    it("initialization calls initializeServices", function () {
        var initializeServicesCalled = false;

        aPage.initializeServices = function () {
            initializeServicesCalled = true;
        };

        aPage.init();

        expect(initializeServicesCalled).toBeTruthy();
    });

    it("initialization calls initializeComponents", function () {
        var initializeComponentsCalled = false;

        aPage.initializeComponents = function () {
            initializeComponentsCalled = true;
        };

        aPage.init();

        expect(initializeComponentsCalled).toBeTruthy();
    });

    it("can lookup for services by name", function () {
        var aServiceName = "a service to be looked up";
        var expectedService = "resulting service";
        directory.getService.andReturn(expectedService);

        var aService = aPage.getService(aServiceName);

        expect(directory.getService).toHaveBeenCalledWith(aServiceName);
        expect(aService).toEqual(expectedService);
    });

    it("by default has an empty baseUrl", function () {
        expect(aPage.getBaseURL()).toEqual("");
    });

    it("allows baseUrl initialization using the constructor", function () {
        aPage = new CUORE.Page("A Base URL");

        expect(aPage.getBaseURL()).toEqual("A Base URL");
    });

    describe("when a service is added", function() {
        var aService, aBaseURL="a base URL";

        var mockService = function() {
            return mock('service', ['getName', 'setBaseURL']);
        };

        beforeEach(function() {
            aService = mockService();
            aPage = new CUORE.Page(aBaseURL);
            aPage.setDirectory(directory);

            aPage.addService(aService);
        });

        it("it sets the baseURL to the service", function() {
            expect(aService.setBaseURL).toHaveBeenCalledWith(aBaseURL);
        });

        it("it adds the service to the directory", function() {
            expect(directory.add).toHaveBeenCalledWith(aService);
        });
    });

    describe("when a component is added", function() {
        var testingContainer = "testingContainer", aComponent;

        var mockComponent=function(name) {
            var component = mock('component '+name, ['setContainer', 'dontReplace', 'setName', 'getManagedEvents', 'draw']);
            component.getManagedEvents.andReturn([]);
            component.getName=function() {
              return component.setName.mostRecentCall.args[0]
            };
            return component;
        };

        beforeEach(function() {
            aComponent = mockComponent('fake');
        }),

        it("registers component with the registry", function () {
            aPage.addComponent(aComponent, testingContainer, true);

            expect(registry.register).toHaveBeenCalledWith(aComponent);
        });

        it("configures the component with a container", function () {
            aPage.addComponent(aComponent, testingContainer, true);

            expect(aComponent.setContainer).toHaveBeenCalledWith(testingContainer);
        });

        it("gives the component a name", function () {
            aPage.addComponent(aComponent, testingContainer, true);

            expect(aComponent.setName).toHaveBeenCalled();
        });

        it("gives the component an unique name", function () {
            var otherComponent = mockComponent('other component');

            aPage.addComponent(aComponent, testingContainer, true);
            aPage.addComponent(otherComponent, testingContainer, true);

            expect(otherComponent.getName()).not.toEqual(aComponent.getName());
        });

        it("configures component not to replace HTML if false is the last parameter", function () {
            aPage.addComponent(aComponent, testingContainer, false);

            expect(aComponent.dontReplace).toHaveBeenCalled();
        });

        it("configures component to replace HTML if true is the last parameter", function () {
            aPage.addComponent(aComponent, testingContainer, true);

            expect(aComponent.dontReplace).not.toHaveBeenCalled();
        });

        it("registers its managed events with the bus", function() {
            var aBus = CUORE.Bus;
            aBus.reset();
            aComponent.getManagedEvents.andReturn(['testEvent', 'dummyEvent']);

            aPage.addComponent(aComponent, testingContainer, true);

            expect(aBus.subscribers("testEvent")).toContain(aComponent);
            expect(aBus.subscribers("dummyEvent")).toContain(aComponent);
        });

        it("and the page is drawn, it will draw each component", function() {
            registry.each.andCallFake(function(callback) {
              callback(aComponent);
            });

            aPage.draw();

            expect(aComponent.draw).toHaveBeenCalled();
        });
    });
});