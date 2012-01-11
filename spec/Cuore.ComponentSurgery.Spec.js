describe("A  Better component", function() {
    var aComponent;
    beforeEach(function() {
        this.addMatchers({
            'toHaveBeenCalledWithAHandlerForEvent': function(expectedEventName) {
                var spy = this.actual;
                var mostRecentCall = spy.mostRecentCall;
                var supposedToBeAHandler = mostRecentCall.args[1];
                return mostRecentCall.args[0] == expectedEventName && supposedToBeAHandler && typeof supposedToBeAHandler == 'object' && typeof supposedToBeAHandler.handle == 'function';
            }
        });

        aComponent = new CUORE.Component();
    });

    it("has a append behaviour by default", function() {
        expect(aComponent.doYouReplace()).toBeFalsy();
    });

    it("can set the behaviour", function() {
        aComponent.behave(CUORE.Behaviours.REPLACE);
        expect(aComponent.doYouReplace()).toBeTruthy();
    });
    
    it("supports hijack behaviour", function() {
        expect(aComponent.doYouHijack()).toBeFalsy();
        aComponent.behave(CUORE.Behaviours.HIJACK);
        expect(aComponent.doYouHijack()).toBeTruthy();
    });

    it("uses container id as UniqueID when hijacking", function() {
        aComponent.behave(CUORE.Behaviours.HIJACK);
        var container= "anID";
        aComponent.setContainer(container);
        expect(aComponent.getName()).toEqual('anID');
        expect(aComponent.getUniqueID()).toEqual('anID');
    });
    
    it("can inject decorations in its renderer", function() {
        var aRenderer={};
        aRenderer.addDecoration ='';
        spyOn(aRenderer,'addDecoration');
        
        aComponent.setRenderer(aRenderer);
                
        aComponent.addDecoration(undefined);
        expect(aRenderer.addDecoration).not.toHaveBeenCalled();
        aComponent.addDecoration(new CUORE.Decoration());
        expect(aRenderer.addDecoration).toHaveBeenCalled();
        
    });
    
    
    it("by default has a handler set", function() {
        var handlerSet = aComponent.handlerSet;

        expect(handlerSet).toBeDefined();
        expect(typeof handlerSet.register).toBe('function');
        expect(typeof handlerSet.notifyHandlers).toBe('function');
    });

    it("has a hook for calling when its environment is up", function() {
        expect(typeof aComponent.onEnvironmentUp === 'function').toBeTruthy();
    });
    
    describe("can manage handlers", function() {
        var aHandlerSet;
        beforeEach(function() {
            aHandlerSet = CUORE.Mocks.HandlerSet();
            aComponent.setHandlerSet(aHandlerSet);
        });

        it("when is asked about its managed events, it returns the managed events from its handler set", function() {
            var expectedManagedEvents = ['eventA', 'eventB'];

            aHandlerSet.getManagedEvents.andReturn(expectedManagedEvents);

            expect(aComponent.getManagedEvents()).toEqual(expectedManagedEvents);
        });

        describe("when you add a handler", function() {
            var aHandler, eventName = "an event name";
            beforeEach(function() {
                aHandler = CUORE.Mocks.Handler();
                aComponent.addHandler(eventName, aHandler);
            });

            it("it registers the handler in the handler set", function() {
                expect(aHandlerSet.register).toHaveBeenCalledWith(eventName, aHandler);
            });

            it("it configures the handler's owner with itself", function() {
                expect(aHandler.setOwner).toHaveBeenCalledWith(aComponent);
            });
        });

        it("when an event is fired, the handler sets is notified", function() {
            var eventParams = "some params",
                eventName = "an event name";

            aComponent.eventDispatch(eventName, eventParams);

            expect(aHandlerSet.notifyHandlers).toHaveBeenCalledWith(eventName, eventParams);
        });
    });

    describe("given a service directory is set", function() {
        var aDirectory;
        beforeEach(function() {
            aDirectory = CUORE.Mocks.Directory();
            aComponent.setDirectory(aDirectory);
        });

        it("should ignore undefined keys when getLabel called", function() {
            aComponent.requestLabelText(null);
            aComponent.requestLabelText(undefined);

            expect(aDirectory.execute).not.toHaveBeenCalled();
        });

        it("can execute a service through the directory", function() {
            var theServiceName = "serviceName";
            var theProcedureName = "procedureName";
            var params = "these are the mock params";

            aComponent.execute(theServiceName, theProcedureName, params, true);

            expect(aDirectory.execute).toHaveBeenCalledWith(theServiceName, theProcedureName, params, true);
        });

        describe("when i18n label is changed", function() {
            var aHandlerSet;
            beforeEach(function() {
                aHandlerSet = CUORE.Mocks.HandlerSet();
                aComponent.setHandlerSet(aHandlerSet);
            });

            it("label service is used to fetch the label text", function() {
                var labelKey = "label.key";

                aComponent.setI18NKey(labelKey);

                expect(aDirectory.execute).toHaveBeenCalledWith("LABELS", 'getLabel', {
                    key: labelKey
                }, true);
            });

            it("and the key is empty, label service won't be used to fetch the label text", function() {
                aComponent.setI18NKey(null);

                expect(aDirectory.execute).not.toHaveBeenCalled();
            });

            it("the component's text is set to the label key while the label service has not yet replied", function() {
                var labelKey = "label.key";

                aComponent.setI18NKey(labelKey);

                expect(aComponent.getText()).toContain(labelKey);
            });

            it("a handler is registered in the handler set to receive the label value", function() {
                var labelKey = "label.key";

                aComponent.setI18NKey(labelKey);

                expect(aHandlerSet.register).toHaveBeenCalledWithAHandlerForEvent('LABELS_getLabel_EXECUTED_' + labelKey);
            });

            it("when dispatch is called, the handler registered to receive the label value changes the component's text", function() {
                var labelKey = "label.key";
                aComponent.setI18NKey(labelKey);
                var handler = aHandlerSet.getLastRegisteredHandler();

                var labelText = 'label text';
                var message = CUORE.Mocks.mock("label message", ['getFromAnswer']);
                message.getFromAnswer.andReturn(labelText);

                handler.handle(message);

                expect(message.getFromAnswer).toHaveBeenCalledWith('text');
                expect(aComponent.getText()).toEqual(labelText);
            });
        });
    });

    describe("given the directory has not yet been set", function() {
        it("can execute a service through the directory", function() {
            var theServiceName = "serviceName";
            var theProcedureName = "procedureName";
            var params = "these are the mock params";

            expect(function() {
                aComponent.execute(theServiceName, theProcedureName, params, true);
            }).toThrow("Cannot call service. A service directory is not configured");
        });

        describe("when i18n label is changed", function() {
            var aHandlerSet;
            beforeEach(function() {
                aHandlerSet = CUORE.Mocks.HandlerSet();
                aComponent.setHandlerSet(aHandlerSet);
            });

            it("and the key is empty it won't change the text", function() {
                var labelKey = "label.key";
                aComponent.setI18NKey(labelKey);

                aComponent.setI18NKey(null);

                expect(aComponent.getText()).toContain(labelKey);
            });

            it("the component's text is set to the label key", function() {
                var labelKey = "label.key";

                aComponent.setI18NKey(labelKey);

                expect(aComponent.getText()).toContain(labelKey);
            });

            it("a handler exists to receive the label value", function() {
                var labelKey = "label.key";

                aComponent.setI18NKey(labelKey);

                expect(aHandlerSet.register).toHaveBeenCalledWithAHandlerForEvent('LABELS_getLabel_EXECUTED_' + labelKey);
            });

            it("when dispatch is called, the handler registered to receive the label value changes the component's text", function() {
                var labelKey = "label.key";
                aComponent.setI18NKey(labelKey);
                var handler = aHandlerSet.getLastRegisteredHandler();

                var labelText = 'label text';
                var message = CUORE.Mocks.mock("label message", ['getFromAnswer']);
                message.getFromAnswer.andReturn(labelText);

                handler.handle(message);

                expect(message.getFromAnswer).toHaveBeenCalledWith('text');
                expect(aComponent.getText()).toEqual(labelText);
            });

            it("a label service is used to fetch the label text but only when the directory is configured", function() {
                var labelKey = "label.key";
                var aDirectory = CUORE.Mocks.Directory();

                aComponent.setI18NKey(labelKey);
                aComponent.setDirectory(aDirectory);

                expect(aDirectory.execute).toHaveBeenCalledWith("LABELS", 'getLabel', {
                    key: labelKey
                }, true);
            });
        });
    });
});