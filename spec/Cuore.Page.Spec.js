describe("Page", function() {
    var aPage, registry, directory;

    beforeEach(function() {
        aPage = new CUORE.Page();
        registry = CUORE.Mocks.Registry();
        directory = CUORE.Mocks.Directory();
        aPage.setDirectory(directory);
        aPage.setRegistry(registry);
    });

    it("initialization calls initializeServices", function() {
        var initializeServicesCalled = false;

        aPage.initializeServices = function() {
            initializeServicesCalled = true;
        };

        aPage.init();

        expect(initializeServicesCalled).toBeTruthy();
    });

    it("initialization calls initializeComponents", function() {
        var initializeComponentsCalled = false;

        aPage.initializeComponents = function() {
            initializeComponentsCalled = true;
        };

        aPage.init();

        expect(initializeComponentsCalled).toBeTruthy();
    });


    it("should set and retrieve states by key", function() {
        var retrievedState = undefined;
        var key = 'arbitraryKey';
        var savedState = 'savedState';
        
        aPage.save(key, savedState);
        retrievedState = aPage.retrieve(key);
        
        expect(retrievedState).toEqual(savedState);
    });


    it("can lookup for services by name", function() {
        var aServiceName = "a service to be looked up";
        var expectedService = "resulting service";
        directory.getService.andReturn(expectedService);

        var aService = aPage.getService(aServiceName);

        expect(directory.getService).toHaveBeenCalledWith(aServiceName);
        expect(aService).toEqual(expectedService);
    });

    it("when baseURL is configured, it informs the directory", function() {
        var baseURL = "A Base URL";
        aPage = new CUORE.Page(baseURL);
        aPage.setDirectory(directory);

        expect(directory.setBaseURL).toHaveBeenCalledWith(baseURL);
    });

    it("when a service is added then adds the service to the directory", function() {
        var aService = CUORE.Mocks.Service();
        aPage.setDirectory(directory);

        aPage.addService(aService);

        expect(directory.add).toHaveBeenCalledWith(aService);
    });

    describe("when a component is added", function() {
        var testingContainer = "testingContainer",
            aComponent;

        beforeEach(function() {
            aComponent = CUORE.Mocks.Component('fake');
        }),

        it("registers component with the registry", function() {
            aPage.addComponent(aComponent, testingContainer, true);

            expect(registry.register).toHaveBeenCalledWith(aComponent);
        });

        it("configures the component with the service directory", function() {
            aPage.addComponent(aComponent, testingContainer, true);

            expect(aComponent.setDirectory).toHaveBeenCalledWith(directory);
        });

        it("configures the component with a container", function() {
            aPage.addComponent(aComponent, testingContainer, true);

            expect(aComponent.setContainer).toHaveBeenCalledWith(testingContainer);
        });

        it("gives the component a name", function() {
            aPage.addComponent(aComponent, testingContainer, true);

            expect(aComponent.setName).toHaveBeenCalled();
        });

        it("gives the component an unique name", function() {
            var otherComponent = CUORE.Mocks.Component('other component');

            aPage.addComponent(aComponent, testingContainer, true);
            aPage.addComponent(otherComponent, testingContainer, true);

            expect(otherComponent.getName()).not.toEqual(aComponent.getName());
        });

        
        it("configures component with the Injecting behaviour provided", function() {
            aPage.addComponent(aComponent, testingContainer, CUORE.Behaviours.REPLACE);

            expect(aComponent.behave).toHaveBeenCalledWith(CUORE.Behaviours.REPLACE);
        });
        
        it("lets component behaviour untouched by default", function() {
            aPage.addComponent(aComponent, testingContainer);
            expect(aComponent.behave).not.toHaveBeenCalled();
        });
        
        it("calls component onEnvinromentUp after bus registering", function() {
            var container = null;
            aComponent.setContainer = jasmine.createSpy('setContainer');
            aComponent.onEnvironmentUp=function(){
                expect(aComponent.setContainer).toHaveBeenCalledWith(testingContainer);
            }

            aPage.addComponent(aComponent, testingContainer);
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