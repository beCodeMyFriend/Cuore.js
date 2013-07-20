CUORE.Helpers = {
    Xhr : function () {
        var xhr = sinon.useFakeXMLHttpRequest();
        var requests = [];

        xhr.onCreate = function(xhr) {
            requests.push(xhr);
        };

        xhr.lastRequest = function() {
            return requests[requests.length - 1];
        };

        xhr.getRequestsCount = function() {
            return requests.length;
        };

        return xhr;
    },

    Server : function() { 
        var server = sinon.fakeServer.create();
        var resquestObject;

        server.startPOST = function(url,response) {
            resquestObject = response || {id: 123,title: "Test"};
            var responseText = JSON.stringify(resquestObject);

            server.respondWith("POST",url, [200,
            {
                "Content-Type": "application/json"
            },
            responseText]);
        }

        server.startGET = function(url,response) {
            resquestObject = response || {id: 123,title: "Test"};
            var responseText = JSON.stringify(resquestObject);

            server.respondWith("GET",url, [200,
            {
                "Content-Type": "application/json"
            },
            responseText]);
        }

        server.getRequestData = function() {
            return resquestObject;
        };        

        return server;
    },

    Subscriber: function(eventName) {
        var aSubscriber = {};
        var anEvent = eventName || "anEvent";
        aSubscriber.eventDispatch = jasmine.createSpy("eventDispatch");

        aSubscriber.getEventName = function() {
            return anEvent;
        }

        return aSubscriber;
    }
}