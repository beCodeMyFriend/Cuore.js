describe("The Bus", function() {

    var aBus;
    aBus = CUORE.Bus;


    it("is a singleton", function() {
        var anotherBus = CUORE.Bus;
        expect(aBus).toBe(anotherBus);
    });

    it("doesn't allows subscription if not a subscriber", function() {
        expect(function() {
            aBus.subscribe("not a subscriber", "anEvent")
        }).toThrow("Not a subscriber (lacks eventDispatch function)");
    });

    describe("allow subscription of subscribers to an event", function() {
        var aSubscriber = {};
        var anEvent = "anEvent";
        aBus = CUORE.Bus;
        aSubscriber.eventDispatch = jasmine.createSpy("eventDispatch");
        aBus.subscribe(aSubscriber, anEvent);

        it("has accountability of subscribers to every event", function() {
            var anotherSubscriber = {};
            anotherSubscriber.eventDispatch = jasmine.createSpy("eventDispatch");

            aBus.subscribe(aSubscriber, "anotherEvent");
            aBus.subscribe(anotherSubscriber, anEvent);

            expect(aBus.subscribers("anotherEvent")).toContain(aSubscriber);
            expect(aBus.subscribers(anEvent)).toContain(aSubscriber);
            expect(aBus.subscribers(anEvent)).toContain(anotherSubscriber);

            expect(aBus.subscribers("anUndefinedEvent")).toEqual([]);
        });

        it("emits events to subscribers", function() {

            var params = {
                param: "param",
                anotherParam: "anotherParam"
            };

            aBus.emit(anEvent, params);
            expect(aSubscriber.eventDispatch).toHaveBeenCalledWith(anEvent, params);

            aSubscriber.eventDispatch.reset();
            aBus.emit("NotForSubscriberEvent", params);
            expect(aSubscriber.eventDispatch).not.toHaveBeenCalled();
        });

        it(" ignores multiple similar subscriptions", function() {
            aBus.subscribe(aSubscriber, anEvent);
            aSubscriber.eventDispatch.reset();
            aBus.emit(anEvent, null);
            expect(aSubscriber.eventDispatch.callCount).toEqual(1);
        });

        describe("allow unsubscription of subscribers to an event", function() {
            var otherSubscriber = {};
            otherSubscriber.name = "other";
            otherSubscriber.eventDispatch = jasmine.createSpy("eventDispatch");

            aBus.subscribe(otherSubscriber, anEvent);
            aBus.unsubscribe(otherSubscriber, anEvent);


            it("doesnt dispatchs the events to unsubscribed", function() {
                otherSubscriber.eventDispatch.reset();
                aBus.emit(anEvent, null);
                expect(otherSubscriber.eventDispatch).not.toHaveBeenCalled();
            });

            it("can unsubscribe multiple events for a subscriber", function() {
                aBus.subscribe(otherSubscriber, anEvent);
                aBus.subscribe(otherSubscriber, "anotherEvent");

                otherSubscriber.eventDispatch.reset();
                aBus.unsubscribe(otherSubscriber, [anEvent, "anotherEvent"]);
                aBus.emit(anEvent, null);
                aBus.emit("anotherEvent", null);
                expect(otherSubscriber.eventDispatch).not.toHaveBeenCalled();
            });

        });

    });

    it("logs at console the events emitted if debug mode is enabled", function() {
        spyOn(console, 'log');

        aBus.emit("eventName", {
            aParamName: 'aParamValue'
        });
        expect(console.log).not.toHaveBeenCalled();

        aBus.enableDebug();
        aBus.emit("eventName", {
            aParamName: 'aParamValue'
        });

        expect(console.log).toHaveBeenCalled();
        expect(console.log.argsForCall[0]).toEqual(['Bus.emit (event, params)']);
        expect(console.log.argsForCall[1]).toEqual(['eventName']);
        expect(console.log.argsForCall[2]).toEqual([{
            aParamName: 'aParamValue'
        }]);
        expect(console.log.argsForCall[3]).toEqual(['------------']);
        aBus.disableDebug();
    });

});