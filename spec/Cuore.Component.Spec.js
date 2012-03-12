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


    describe(" can have different behaviours ", function() {

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
            var container = "anID";
            aComponent.setContainer(container);
            expect(aComponent.getName()).toEqual(container);
            expect(aComponent.getUniqueID()).toEqual(container);
        });
    });


    describe("manages handlers", function() {
        var aHandlerSet;
        beforeEach(function() {
            aHandlerSet = CUORE.Mocks.HandlerSet();
            aComponent.setHandlerSet(aHandlerSet);
        });

        it("by default has a handler set", function() {
            var handlerSet = aComponent.handlerSet;

            expect(handlerSet).toBeDefined();
            expect(typeof handlerSet.register).toBe('function');
            expect(typeof handlerSet.notifyHandlers).toBe('function');
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
            });

            it("registers the handler in the handler set", function() {
                aComponent.addHandler(eventName, aHandler);
                expect(aHandlerSet.register).toHaveBeenCalledWith(eventName, aHandler);
            });

            it("configures the handler's owner with itself", function() {
                aComponent.addHandler(eventName, aHandler);
                expect(aHandler.setOwner).toHaveBeenCalledWith(aComponent);
            });

            it("registers the handler in the bus", function() {
                CUORE.Bus.subscribe = jasmine.createSpy('subscribe');
                aComponent.addHandler(eventName, aHandler);
                expect(CUORE.Bus.subscribe).toHaveBeenCalledWith(aComponent, eventName);
            });
        });

        it("has a shortcut for adding executor handlers", function() {
            var method = 'methodForExecutorHandler';
            var eventName = 'an event name';
            aComponent.addHandler = jasmine.createSpy('addHandler');
            aComponent.methodForExecutorHandler = jasmine.createSpy('daMethod');

            aComponent.addExecHandler(eventName, method);

            var daHandler = aComponent.addHandler.mostRecentCall.args[1];
            daHandler.setOwner(aComponent);
            daHandler.handle();

            expect(aComponent.addHandler).toHaveBeenCalled();
            expect(daHandler instanceof CUORE.Handlers.Executor).toBeTruthy();
            expect(aComponent.methodForExecutorHandler).toHaveBeenCalled();

        });

        it("when an event is fired, the handlersets notifies", function() {
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


        it("retrieves labels when a directory is set", function() {
            var labelKey = "label.key";
            var aDirectory = CUORE.Mocks.Directory();

            aComponent.setI18NKey(labelKey);
            aComponent.setDirectory(aDirectory);

            expect(aDirectory.execute).toHaveBeenCalledWith("LABELS", 'getLabel', {
                key: labelKey
            }, true);
        });

    });


    describe("has a Renderer", function() {
        var aComponent;
        var aRenderer;

        beforeEach(function() {
            aComponent = new CUORE.Component();
            aRenderer = {};
            aComponent.setRenderer(aRenderer);
        });

        it("calling it when the component is drawn", function() {
            aRenderer.render = jasmine.createSpy('render');

            aComponent.draw();

            expect(aRenderer.render).toHaveBeenCalled();
        });

        it("calling it whenever enabled state is changed", function() {
            aRenderer.update = jasmine.createSpy('update');
            aComponent.enable();
            aComponent.disable();
            expect(aRenderer.update.callCount).toEqual(2);
        });

        it("can inject decorations in its renderer", function() {
            aRenderer.addDecoration = jasmine.createSpy('addDecoration');

            aComponent.addDecoration(undefined);
            expect(aRenderer.addDecoration).not.toHaveBeenCalled();

            aComponent.addDecoration(new CUORE.Decoration());
            expect(aRenderer.addDecoration).toHaveBeenCalled();
        });

        it("calls renderer when the component is destroyed", function() {
            aRenderer.erase = jasmine.createSpy('erase');
            aComponent.destroy();
            expect(aRenderer.erase).toHaveBeenCalled();
        });

        it("delegates html class behaviour ", function() {
            aRenderer.addClass = jasmine.createSpy('addClass');
            aRenderer.removeClass = jasmine.createSpy('removeClass');
            aComponent.addClass('aClass');
            aComponent.removeClass('aClass');
            expect(aRenderer.addClass).toHaveBeenCalledWith('aClass');
            expect(aRenderer.removeClass).toHaveBeenCalledWith('aClass');
        });
    });

    it("has a hook for calling when its environment is up", function() {
        expect(typeof aComponent.onEnvironmentUp === 'function').toBeTruthy();
    });

    it("set unique name by default", function() {
        var anotherComponent = new CUORE.Component();
        expect(aComponent.getName()).not.toEqual(anotherComponent.getName());
    });

    it("could be explicitly named", function() {
        var testingName = "aTestName";
        aComponent.setName(testingName);
        expect(aComponent.getName()).toEqual(testingName);
    });

    it("could be removed", function() {
        spyOn(CUORE.Bus, "unsubscribe");
        aComponent.destroy();
        expect(CUORE.Bus.unsubscribe).toHaveBeenCalledWith(aComponent, aComponent.getManagedEvents());

    });

    it("has enable state", function() {
        expect(aComponent.isEnabled()).toBeTruthy();
    });

    it("can be disabled", function() {
        aComponent.disable();
        expect(aComponent.isEnabled()).toBeFalsy();
    });

    it("can be enabled", function() {
        aComponent.disable();
        aComponent.enable();

        expect(aComponent.isEnabled()).toBeTruthy();
    });
});