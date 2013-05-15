CUORE.Requests = (function(undefined) {


    var post = function(url, data, callback) {
        var request = _createXHR();

        if (!request) return;

        request.onreadystatechange = function() {
            var isReadyStateOK = (request.readyState === 4);
            var isStatusOK = false;
            if (isReadyStateOK) {
                isStatusOK = (request.status === 200 || request.status === 304);
            }

            if (isReadyStateOK && isStatusOK) {
                try {
                    parsedResponse = request.responseText;
                    var isString = (typeof request.responseText === 'string');
                    if (isString) parsedResponse = JSON.parse(request.responseText);
                } catch (e) {
                    parsedResponse = new CUORE.Message();
                }
                callback(parsedResponse);
            }
        };

        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(data);
    };

    var _createXHR = function() {
        return new XMLHttpRequest();
    };


    return {
        post: post,
    };

})();