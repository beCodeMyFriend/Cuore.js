describe("Core.response", function() {

    var URL = 'aUrl';

    it("callback called with json formatted response", function() {
        var responseObject = {
            "id": 123,
            "title": "Hollywood - Part 2"
        };
        var responseText = JSON.stringify(responseObject);
        
        var server = sinon.fakeServer.create();
        server.respondWith("POST", URL, [200,
        {
            "Content-Type": "application/json"
        },
        responseText]);

        var callback = jasmine.createSpy();
        CUORE.Core.request(URL, 'someInputData', callback);

        server.respond();
        
        
        expect(callback).toHaveBeenCalledWith(responseObject);

        server.restore();
    });


    it('should receive a json and send a string', function() {
        var xhr = sinon.useFakeXMLHttpRequest();
        var requests = [];

        xhr.onCreate = function(xhr) {
            requests.push(xhr);
        };

        CUORE.Core.createXHR = function() {
            return xhr;
        };

        var aJsonInputData = {
            'key': 'value'
        };

        var callback = sinon.spy();
        CUORE.Core.request(URL, aJsonInputData, callback);

        var usedXhr = requests[1];
        var dataSended = usedXhr.requestBody;

        var expectedSendedValue = JSON.stringify(aJsonInputData); 
        expect(dataSended).toBe(expectedSendedValue);

        xhr.restore();
    });
});