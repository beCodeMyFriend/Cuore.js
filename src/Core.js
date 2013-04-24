CUORE.Core = (function(undefined) {

    var OBJ_PROTO = Object.prototype;

    var bind = function(obj, method) {
        return function() {
            return method.apply(obj, [].slice.call(arguments));
        };
    };

    var isOwnProperty = function(object, property) {
        return OBJ_PROTO.hasOwnProperty.call(object, property);
    };

    var toType = function(object) {
        return OBJ_PROTO.toString.call(object).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
    };


    var _indexOfPolyfill = function() {

        [].indexOf || (Array.prototype.indexOf = function(
        item, index, theLength) {
            for (
            var theLength = this.length, index = (theLength + ~~index) % theLength;
            index < theLength && ((!(index in this) || this[index] !== item));
            index++);
            return index ^ theLength ? index : -1;
        })
    };

    var request = function(url, data, callback) {
        if (!_createXHR()) return;
        var request = _createXHR();
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

    _indexOfPolyfill();

    return {
        request: request,
        bind: bind,
        isOwnProperty: isOwnProperty,
        toType: toType
    };

})();