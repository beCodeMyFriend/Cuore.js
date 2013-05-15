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
    }
}