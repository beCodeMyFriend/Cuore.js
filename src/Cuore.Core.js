CUORE.Core = (function(undefined) {
    
    var OBJ_PROTO = Object.prototype;
    
    var bind = function(obj, method) {
        return function() {
            return method.apply(obj, [].slice.call(arguments));
        }
    };
    
    var request = function(url, data, callback) {
        if (!_createXHR()) return; 
        
        var request = _createXHR();
        request.onreadystatechange = function () {
            var isReadyStateOK = (request.readyState === 4);
            var isStatusOK = (request.status === 200 || request.status === 304);
            
            if (isReadyStateOK && isStatusOK) {
                var parsedResponse = JSON.parse(request.responseText); //@TODO
                callback(parsedResponse);
            }
        }    
        
        request.open('POST', url, true);
        request.send(JSON.stringify(data)); //@TODO
    };
    
    var isOwnProperty = function(object, property) {
        return OBJ_PROTO.hasOwnProperty.call(object, property);
    };
    
    var toType = function(object) {
        return OBJ_PROTO.toString.call(object).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
    };
    
    var _createXHR = function() {
        return new XMLHttpRequest();
    };
    
    return {
        bind: bind,
        request: request,
        isOwnProperty: isOwnProperty,
        toType: toType
    };

})();