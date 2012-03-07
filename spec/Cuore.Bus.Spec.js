describe("The Bus", function () {

    it("is a singleton", function () {
        var aBus = CUORE.Bus;
        var anotherBus = CUORE.Bus;

        expect(aBus).toBe(anotherBus);
    });


    it("has accountability of subscribers to every event", function () {
        var aBus = CUORE.Bus;
        aBus.subscribe("aSubscriber", "anEvent");
        aBus.subscribe("aSubscriber", "anotherEvent");
        aBus.subscribe("anotherSubscriber", "anEvent");

        expect(aBus.subscribers("anotherEvent")).toContain("aSubscriber");
        expect(aBus.subscribers("anEvent")).toContain("aSubscriber");
        expect(aBus.subscribers("anEvent")).toContain("anotherSubscriber");

        expect(aBus.subscribers("anUndefinedEvent")).toEqual([]);
    });

    it("registers suscribers and emits events to them", function () {
        var aBus = CUORE.Bus;
        

        var dummySubscriber = createDummySubscriber();
        var event = "myEvent";
        var params = {
            param: "param",
            anotherParam: "anotherParam"
        };

        aBus.subscribe(dummySubscriber, event);
        aBus.emit(event, params);

        expect(dummySubscriber.recievedEvent).toEqual(event);
        expect(dummySubscriber.recievedParams).toEqual(params);

        var anotherDummySubscriber = createDummySubscriber();
        var anotherEvent = "anotherEventuos";
        var anotherParams = {
            param: "randomParam",
            anotherParam: "testParam"
        };

        aBus.subscribe(anotherDummySubscriber, anotherEvent);
        aBus.subscribe(dummySubscriber, anotherEvent);
        aBus.emit(anotherEvent, anotherParams);

        expect(anotherDummySubscriber.recievedEvent).toEqual(anotherEvent);
        expect(anotherDummySubscriber.recievedParams).toEqual(anotherParams);

        expect(dummySubscriber.recievedEvent).toEqual(anotherEvent);
        expect(dummySubscriber.recievedParams).toEqual(anotherParams);
    });

    it("unregister subscribers", function () {
        var aBus = CUORE.Bus;
        

        var dummySubscriber = createDummySubscriber();
        var anotherDummySubscriber = createDummySubscriber();

        var event = "myEvent";
        var anotherEvent = "anotherEventicoloso";
        var params = {
            aParam: "old"
        };
        var anotherParams = {
            aParam: "new"
        };

        aBus.subscribe(dummySubscriber, event);
        aBus.subscribe(dummySubscriber, anotherEvent);
        aBus.subscribe(anotherDummySubscriber, event);

        aBus.emit(event, params);

        expect(dummySubscriber.recievedParams).toEqual(params);
        expect(anotherDummySubscriber.recievedParams).toEqual(params);

        aBus.unsubscribe(dummySubscriber, [event, anotherEvent]);
        aBus.emit(event, anotherParams);
        aBus.emit(anotherEvent, anotherParams);

        expect(dummySubscriber.recievedParams).toEqual(params);
        expect(anotherDummySubscriber.recievedParams).toEqual(anotherParams);
    });

    it("cannot have subscribed the same object twice for the same event", function () {
        var aBus = CUORE.Bus;
        aBus.reset();

        var event = "testEvent";
        var dummySubscriber = {
            "test": "test"
        };

        aBus.subscribe(dummySubscriber, event);
        aBus.subscribe(dummySubscriber, event);

        expect(aBus.subscribers(event).length, 1);

        var anotherDummySubscriber = dummySubscriber;

        aBus.subscribe(dummySubscriber, event);
        aBus.subscribe(anotherDummySubscriber, event);

        expect(aBus.subscribers(event).length, 1);

        var similarDummySubscriber = {
            "test": "test"
        };

        aBus.subscribe(similarDummySubscriber, event);

        expect(aBus.subscribers(event).length, 2);
    });

    it("logs at console the events emitted if debug mode is enabled", function() {
        spyOn(console, 'log');
        var aBus = CUORE.Bus;

        aBus.emit("eventName", {aParamName: 'aParamValue'});
        expect(console.log).not.toHaveBeenCalled();

        aBus.enableDebug();
        aBus.emit("eventName", {aParamName: 'aParamValue'});

        expect(console.log).toHaveBeenCalled();
        expect(console.log.argsForCall[0]).toEqual(['Bus.emit (event, params)']);
        expect(console.log.argsForCall[1]).toEqual(['eventName']);
        expect(console.log.argsForCall[2]).toEqual([{ aParamName : 'aParamValue' }]);
        expect(console.log.argsForCall[3]).toEqual(['------------']);
        aBus.disableDebug();
    });

    var createDummySubscriber = function() {
        var dummySubscriber = {};
        dummySubscriber.eventDispatch = function (event, params) {
            this.recievedEvent = event;
            this.recievedParams = params;
        };

        return dummySubscriber;

    };
});
