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

    _indexOfPolyfill();

    return {
        bind: bind,
        isOwnProperty: isOwnProperty,
        toType: toType
    };

})();
