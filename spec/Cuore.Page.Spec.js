describe("Page", function() {
    var aPage;

    beforeEach(function() {
        aPage = new CUORE.Page();
    });

    it("calls initializeServices at instanciation", function() {
        spyOn(aPage, "initializeServices");
        aPage.init();
        expect(aPage.initializeServices).toHaveBeenCalled();
    });

    it("calls initializeComponents at instanciation", function() {
        spyOn(aPage, "initializeComponents");
        aPage.init();
        expect(aPage.initializeComponents).toHaveBeenCalled();
    });

    it("should set and retrieve states by key", function() {
        var key = 'arbitraryKey';
        var savedState = 'savedState';

        aPage.save(key, savedState);
        var retrievedState = aPage.retrieve(key);

        expect(retrievedState).toEqual(savedState);
    });

    describe("uses a Directory for managing services", function() {
        var directory;

        beforeEach(function() {
            directory = CUORE.Mocks.Directory();
            aPage.setDirectory(directory);
        });

        it("can lookup for services by name", function() {
            var aServiceName = "a service to be looked up";
            var expectedService = "resulting service";
            directory.getService.andReturn(expectedService);

            var aService = aPage.getService(aServiceName);

            expect(directory.getService).toHaveBeenCalledWith(aServiceName);
            expect(aService).toEqual(expectedService);
        });

        /*it("when baseURL is configured, it informs the directory", function() {
            var baseURL = "A Base URL";
            aPage = new CUORE.Page(baseURL);
            aPage.setDirectory(directory);

            expect(directory.setBaseURL).toHaveBeenCalledWith(baseURL);
        });*/

        it("when a service is added then adds the service to the directory", function() {
            var aService = CUORE.Mocks.Service();
            aPage.setDirectory(directory);
            aPage.addService(aService);

            expect(directory.add).toHaveBeenCalledWith(aService);
        });

    });


    describe("when a component is added", function() {
        var testingContainer = "testingContainer",
            aComponent, registry;

        beforeEach(function() {
            registry = CUORE.Mocks.Registry();
            aPage.setRegistry(registry);
            aComponent = CUORE.Mocks.Component('fake');
        }),

        it("registers component with the registry", function() {
            aPage.addComponent(aComponent, testingContainer, true);
            expect(registry.register).toHaveBeenCalledWith(aComponent);
        });

        it("configures the component with the service directory", function() {
            var aDirectory = CUORE.Mocks.Directory();
            aPage.setDirectory(aDirectory);
            aPage.addComponent(aComponent, testingContainer, true);
            expect(aComponent.setDirectory).toHaveBeenCalledWith(aDirectory);
        });

        it("configures the component with a container", function() {
            aPage.addComponent(aComponent, testingContainer, true);
            expect(aComponent.setContainer).toHaveBeenCalledWith(testingContainer);
        });


        it("has a method that returns the component that matchs with the id", function() {
            aPage.addComponent(aComponent, testingContainer, true);

            aPage.getComponentWithDOMId('id');

            expect(registry.filterByName).toHaveBeenCalledWith('id');
        });

        it("configures component with the Injecting behaviour provided", function() {
            aPage.addComponent(aComponent, testingContainer, CUORE.Behaviours.REPLACE);
            expect(aComponent.behave).toHaveBeenCalledWith(CUORE.Behaviours.REPLACE);
        });

        it("lets component behaviour untouched by default", function() {
            aPage.addComponent(aComponent, testingContainer);
            expect(aComponent.behave).not.toHaveBeenCalled();
        });

        it("calls component onEnvinromentUp after been register in the page", function() {
            var container = null;
            aComponent.setContainer = jasmine.createSpy('setContainer');
            aComponent.onEnvironmentUp = function() {
                expect(aComponent.setContainer).toHaveBeenCalledWith(testingContainer);
            }
            aPage.addComponent(aComponent, testingContainer);
        });

        it("and when the page is drawn, it will call draw in each component", function() {
            registry.each.andCallFake(function(callback) {
                callback(aComponent);
            });

            aPage.draw();

            expect(aComponent.draw).toHaveBeenCalled();
        });
    });
});