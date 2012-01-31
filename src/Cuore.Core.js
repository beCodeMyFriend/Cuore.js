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
            request.onreadystatechange = function() {
                var isReadyStateOK = (request.readyState === 4);
                var isStatusOK = (request.status === 200 || request.status === 304);

                if (isReadyStateOK && isStatusOK) {
                    var parsedResponse = JSON.parse(request.responseText);
                    callback(parsedResponse);
                }

            }

            request.open('POST', url, true);
            request.send(JSON.stringify(data));
        };

     var requestGet = function(url, data, callback) {
        if (!_createXHR()) return;
        var request = _createXHR();
        request.onreadystatechange = function() {
            var isReadyStateOK = (request.readyState === 4);
            var isStatusOK = (request.status === 200 || request.status === 304);

            if (isReadyStateOK && isStatusOK) {
                var parsedResponse = JSON.parse(request.responseText); 
                callback(parsedResponse);
            }

        }

        request.open('GET', url + _map2query(data), true);
        request.send(); 
    };

    var requestJSONP = function(url, data, callback) {
        
            callback = callback || function(){};
            var script = document.createElement("script");
            var callbackName = 'F' + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            
            window[callbackName]= function(response){
                    callback(response);
                    var theScript= document.getElementById(callbackName);
                    document.getElementsByTagName("head")[0].removeChild(theScript);
                };
            script.id = callbackName;
            script.type = "text/javascript";
            script.src = url + callbackName + _serialize(data) ;
            document.getElementsByTagName("head")[0].appendChild(script);
            
            
            return callbackName;
        };


    var _serialize=function (data){
        var amp="&";
        var serialized = amp;
        for (var key in data)
        {
            serialized=serialized + key + "=" + data[key] + amp;
        }
        return serialized;
    }

    var isOwnProperty = function(object, property) {
        return OBJ_PROTO.hasOwnProperty.call(object, property);
    };

    var toType = function(object) {
        return OBJ_PROTO.toString.call(object).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
    };

    var _createXHR = function() {
        return new XMLHttpRequest();
    };

   var _map2query = function(map){
      
       if( typeof map != 'object' ) return '';

       var query = '';
       for(var prop in map) if (map.hasOwnProperty(prop) ) {
            query += '&' + encodeURIComponent(prop) + '=' + encodeURIComponent(map[prop]);
       }

       var url = query.replace(/^&/,'');
       if(url !== '') url = '?' + url;

       return url;
    };

    return {
        bind: bind,
        request: request,
        requestGet: requestGet,
        requestJSONP: requestJSONP,
        isOwnProperty: isOwnProperty,
        toType: toType
    };

})();