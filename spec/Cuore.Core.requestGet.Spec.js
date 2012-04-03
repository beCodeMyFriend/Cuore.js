describe("Core request Get", function() {

    var URL = 'aUrl';

    it("callback called with json formatted response", function() {
        var responseObject = {
            "id": 123,
            "title": "Hollywood - Part 2"
        };
        var responseText = JSON.stringify(responseObject);
        var server = sinon.fakeServer.create();
        server.respondWith("GET", URL, [200,
        {
            "Content-Type": "application/json"
        },
        responseText]);
        var callback = sinon.spy();

        CUORE.Core.requestGet(URL, 'someInputData', callback);
        server.respond();

        expect(callback.calledWith(responseObject)).toBeTruthy();
    });

    describe("when params are used in the url", function() {
        var xhr;
        var requests;

        beforeEach(function() {
            xhr = sinon.useFakeXMLHttpRequest();
            requests = [];

            xhr.onCreate = function(xhr) {
                requests.push(xhr);
            };

            CUORE.Core.createXHR = function() {
                return xhr;
            };
        });

        afterEach(function() {
            xhr.restore();
        });

        var lastSentUrl = function() {
                var usedXhr = requests[1];
                var sentUrl = usedXhr.url;
                return sentUrl;
            };

        it('should send the data in the url', function() {
            var aJsonInputData = {
                'key': 'value',
                'anotherkey': 'another_value'
            };
            var expectedSentUrl = URL + '?key=value&anotherkey=another_value';
            var callback = sinon.spy();
            
            CUORE.Core.requestGet(URL, aJsonInputData, callback);

            expect(lastSentUrl()).toBe(expectedSentUrl);
        });

        it('parses empty spaces', function() {
            var aJsonInputData = {
                'key': 'a value'
            };
            var expectedSentUrl = URL + '?key=a%20value';
            var callback = sinon.spy();
            
            CUORE.Core.requestGet(URL, aJsonInputData, callback);
            
            expect(lastSentUrl()).toBe(expectedSentUrl);
        });

        it('scapes non url characters', function() {
            var aJsonInputData = {
                'key': 'value&anothervalue'
            };
            var expectedSentUrl = URL + '?key=value%26anothervalue';
            var callback = sinon.spy();
            
            CUORE.Core.requestGet(URL, aJsonInputData, callback);
            
            expect(lastSentUrl()).toBe(expectedSentUrl);
        });

    });

});