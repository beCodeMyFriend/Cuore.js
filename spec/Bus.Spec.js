describe("The Bus", function() {

    var mainBus = CUORE.Bus;

    beforeEach(function() {        
        this.addMatchers(CUORE.Matchers);
    });

    it("is a singleton", function() {
        var otherBus = CUORE.Bus;
        expect(CUORE.Bus).toBe(otherBus);
    });

    it("doesn't allows subscription if not a subscriber", function() {
        expect(function() {
            mainBus.subscribe("not a subscriber", "anEvent")
        }).toThrow("Not a subscriber (lacks eventDispatch function)");
    });

    describe("allow subscription of subscribers to an event", function() {
        var aSubscriber = CUORE.Helpers.Subscriber();
        mainBus.subscribe(aSubscriber, aSubscriber.getEventName);

        it("has accountability of events for every subscriber", function() {
            var anEvent = "anEvent";
            var anotherEvent = "anotherEvent";
            var anotherSubscriber = CUORE.Helpers.Subscriber();

            mainBus.subscribe(aSubscriber, anotherEvent);
            mainBus.subscribe(aSubscriber, anEvent);

            expect(mainBus.events(aSubscriber)).toContain(anEvent);
            expect(mainBus.events(aSubscriber)).toContain(anotherEvent);

            expect(mainBus.events("anUndefinedSubscriber")).toEqual([]);
        });

        it("emits events to subscribers", function() {

            var params = {
                param: "param",
                anotherParam: "anotherParam"
            };

            mainBus.emit(aSubscriber.getEventName, params);
            expect(aSubscriber.eventDispatch).toHaveBeenCalledWith(aSubscriber.getEventName, params);

            aSubscriber.eventDispatch.reset();
            mainBus.emit("NotForSubscriberEvent", params);
            expect(aSubscriber.eventDispatch).not.toHaveBeenCalled();
        });

        it(" ignores multiple similar subscriptions", function() {
            mainBus.subscribe(aSubscriber, aSubscriber.getEventName);
            aSubscriber.eventDispatch.reset();
            mainBus.emit(aSubscriber.getEventName, null);
            expect(aSubscriber.eventDispatch.callCount).toEqual(1);
        });

        describe("allow unsubscription of subscribers to an event", function() {
            var otherSubscriber = CUORE.Helpers.Subscriber();

            mainBus.subscribe(otherSubscriber, otherSubscriber.getEventName);
            mainBus.unsubscribe(otherSubscriber, otherSubscriber.getEventName);


            it("doesn't dispatchs the events to unsubscribed", function() {
                otherSubscriber.eventDispatch.reset();
                mainBus.emit(otherSubscriber.getEventName, null);
                expect(otherSubscriber.eventDispatch).not.toHaveBeenCalled();
            });

            it("can unsubscribe event for a subscriber", function() {

                mainBus.subscribe(otherSubscriber, otherSubscriber.getEventName);

                otherSubscriber.eventDispatch.reset();
                mainBus.unsubscribe(otherSubscriber, otherSubscriber.getEventName)
                mainBus.emit(otherSubscriber.getEventName, null);
                expect(otherSubscriber.eventDispatch).not.toHaveBeenCalled();
            });

        });

    });

    it("logs at console the events emitted if debug mode is enabled", function() {
        spyOn(console, 'log');

        mainBus.emit("eventName", {
            aParamName: 'aParamValue'
        });
        expect(console.log).not.toHaveBeenCalled();

        mainBus.enableDebug();
        mainBus.emit("eventName", {
            aParamName: 'aParamValue'
        });

        expect(console.log).toHaveBeenCalled();
        expect(console.log.argsForCall).toEqual([['Bus.emit (event, params)'],
                                                ['eventName'],
                                                [{aParamName: 'aParamValue'}],
                                                ['------------']]);
        mainBus.disableDebug();
    });

});