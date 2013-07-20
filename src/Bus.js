CUORE.Bus = (function(undefined) {

    var subscriptions = [];
    var debugMode = false;

    var subscribe = function(subscriber, eventName) {
            _validSubscriber(subscriber);
            subscription = _subscriptionExists(subscriber, eventName);
            if (subscription.exist) {
                return;
            }

            subscriptions.push([subscriber, eventName]);
        };

    var unsubscribe = function(subscriber, eventName) {

            subscription = _subscriptionExists(subscriber,eventName);
            if(!subscription.exist){
                return;
            }

            subscriptions.splice(subscription.position, 1);
        };

    /*var hasSubscriptions = function() {
            return (subscriptions.length > 0);
        };*/

    var emit = function(eventName, params) {
            var subscribersList = _subscribers(eventName);

            _debug(eventName,params);

            for (var i = 0, len = subscribersList.length; i < len; i++) {
                subscribersList[i].eventDispatch(eventName, params);
            }
    };

    var events = function(subscriber){
           var selectedEvents = [];

           for (var i = 0, len = subscriptions.length, subscription; i < len; i++) {
                subscription = subscriptions[i];
                var sameSubscriber = (subscription[0] === subscriber);
                if (sameSubscriber) {
                    selectedEvents.push(subscription[1]);
                }
            }
            return selectedEvents; 
    }

    var _subscriptionExists = function(subscriber, eventName) {
            var result = false;

            for (var i = 0, len = subscriptions.length, subscription; i < len; i++) {
                subscription = subscriptions[i];
                var sameSubscriber = (subscription[0] === subscriber);
                var sameEvent = (subscription[1] === eventName);

                if (sameSubscriber && sameEvent) {
                    result = true;
                    return { 'exist': result,'position': i};
                }
            }
            return { 'exist': result,'position': -1};
    };

    var _subscribers = function(theEvent) {
            var selectedSubscribers = [];
            for (var i = 0, len = subscriptions.length; i < len; i++) {
                var subscription = subscriptions[i];
                if (subscription[1] === theEvent) {
                    selectedSubscribers.push(subscription[0]);
                }
            }
            return selectedSubscribers;
    };

    var _validSubscriber = function(subscriber) {
            if (!subscriber.eventDispatch) throw new Error("Not a subscriber (lacks eventDispatch function)");
    };

    var _debug = function(eventName,params) {
            if (!debugMode) {
                return;
            }

            console.log("Bus.emit (event, params)");
            console.log(eventName);
            console.log(params);
            console.log("------------");
        };

    var enableDebug = function() {
            debugMode = true;
        }

    var disableDebug = function() {
            debugMode = false;
        }

    return {
        subscribe: subscribe,
        unsubscribe: unsubscribe,
        emit: emit,
        events: events,
        enableDebug: enableDebug,
        disableDebug: disableDebug
    };

})();