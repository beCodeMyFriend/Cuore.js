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

    var get = function(url, data, callback) {
        if (!_createXHR()) return;
        var request = _createXHR();
        request.onreadystatechange = function() {
            var isReadyStateOK = (request.readyState === 4);
            var isStatusOK = (request.status === 200 || request.status === 304);

            if (isReadyStateOK && isStatusOK) {
                var parsedResponse = JSON.parse(request.responseText);
                callback(parsedResponse);
            }

        };

        request.open('GET', url + _map2query(data), true);
        request.send();
    };

    var jsonp = function(url, data, callback) {

        callback = callback || function() {};
        var script = document.createElement("script");
        var callbackName = 'F' + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

        window[callbackName] = function(response) {
            callback(response);
            var theScript = document.getElementById(callbackName);
            document.getElementsByTagName("head")[0].removeChild(theScript);
        };
        script.id = callbackName;
        script.type = "text/javascript";
        script.src = url + callbackName + _serialize(data);
        document.getElementsByTagName("head")[0].appendChild(script);


        return callbackName;
    };

    var _createXHR = function() {
        return new XMLHttpRequest();
    };

    var _map2query = function(map) {

        if (typeof map != 'object') return '';

        var query = '';
        for (var prop in map) if (map.hasOwnProperty(prop)) {
            query += '&' + encodeURIComponent(prop) + '=' + encodeURIComponent(map[prop]);
        }

        var url = query.replace(/^&/, '');
        if (url !== '') url = '?' + url;

        return url;
    };

    return {
        post: post,
        get: get,
        jsonp: jsonp
    };

})();