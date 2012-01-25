CUORE.Bus = (function(undefined) {

    var subscriptions = [];
    var debugModeON = false;

    var subscribe = function(subscriber, eventName) {
        if (!_subscriptionExists(subscriber, eventName)) {
            subscriptions.push([subscriber, eventName]);
        }
    };

    var unsubscribe = function(subscriber, events) {
        for (var i = 0, len = events.length; i < len; i++) {
            var theSubscription = [subscriber, events[i]];
            _removeSubscription(theSubscription);
        }
    };

    var hasSubscriptions = function() {
        return (subscriptions.length > 0);
    };

    var subscribers = function(theEvent) {
        var selectedSubscribers = [];
        for (var i = 0, len = subscriptions.length; i < len; i++) {
            var subscription = subscriptions[i];
            if (subscription[1] === theEvent) {
                selectedSubscribers.push(subscription[0]);
            }
        }
        return selectedSubscribers;
    };

    var emit = function(eventName, params) {
        var subscribersList = this.subscribers(eventName);

        debug("Bus.emit (event, params)");
        debug(eventName);
        debug(params);
        debug("------------");

        for (var i = 0, len = subscribersList.length; i < len; i++) {
            subscribersList[i].eventDispatch(eventName, params);
        }
    };

    var reset = function() {
        subscriptions = [];
    };

    var _subscriptionExists = function(subscriber, eventName) {
        var result = false;
        var theSubscription = [subscriber, eventName];

        for (var i = 0, len = subscriptions.length; i < len; i++) {
            var subscription = subscriptions[i];
            var sameSubscriber = (subscription[0] === theSubscription[0]);
            var sameEvent = (subscription[1] === theSubscription[1]);
            if (sameSubscriber && sameEvent) {
                result = true;
                break;
            }
        }
        return result;
    }

    var _removeSubscription = function(theSubscription) {
        for (var i = 0, subscription; subscription = subscriptions[i]; i++) {
            var sameSubscriber = (subscription[0] === theSubscription[0]);
            var sameEvent = (subscription[1] === theSubscription[1]);
            if (sameSubscriber && sameEvent) {
                subscriptions.splice(i, 1);
            }
        }
    };

    var debug = function (object) {
        if (debugModeON) {
            console.log(object);
        }
    };

    var enableDebug = function(){
        debugModeON = true;
    }
    
    var disableDebug = function(){
        debugModeON = false;
    }
    
    return {
        subscribe: subscribe,
        unsubscribe: unsubscribe,
        hasSubscriptions: hasSubscriptions,
        subscribers: subscribers,
        emit: emit,
        reset: reset,
        enableDebug: enableDebug,
        disableDebug: disableDebug
    };

})();
