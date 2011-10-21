CUORE.Dom.Event = (function(undefined) {

    var _eventManager = {
        add: function(element, eventName, functionToExecute) {
            this._initializeStructure(element, eventName);
            
            element.events[eventName].push(functionToExecute);
        },

        remove: function(element, eventName) {
            if(this.hasEvents(element, eventName)) {
                element.events[eventName] = [];
            }
        },

        fire: function(element, eventName) {
            if (!this.hasEvents(element, eventName)) return;
            
            var callbacks = element.events[eventName];
            for (var i = 0, len = callbacks.length; i < len; i++) {
                callbacks[i]();
            }
        },

        hasEvents: function(element, eventName) {
            var elementHasEvents = (element.events && element.events[eventName]
                                    && element.events[eventName].length > 0);

            return (elementHasEvents) ? true : false;
        },
        
        _initializeStructure: function(element, eventName){
            !element.events && (element.events = {});
            !element.events[eventName] && (element.events[eventName] = []);
        }
    };
    
    var add = function(el, type, fn) {
        _eventManager.add(el, type, fn);
        _addEventListener(el, type, fn);
    };

    var remove = function(el, type, fn) {
        _removeEventListener(el, type, fn);
        _eventManager.remove(el, type);
    };
    
    var stopDefault = function(el, type) {
        add(el, type, function(event) {
            if (!event) return;

            event.preventDefault();
            event.stopPropagation();
        });
    };

    var hasEvents = function(el, type) {
        return _eventManager.hasEvents(el, type);
    };

    var fire = function(el, type) {
        _eventManager.fire(el, type);
    };

    var _addEventListener = function(el, type, fn){
        
        if (_isW3cListener()) { 
            el.addEventListener(type, fn, false);
        }
        
        if (_isIEListener()) { 
            el.attachEvent('on' + type, fn);
        }
        
        if (!_isIEListener() && !_isW3cListener()) { 
            el['on' + type] = fn;
        }
    };
   
    var _removeEventListener = function(el, type, fn){
        
        if (_isW3cListener()) { 
            _removeMultipleEventListener(el, type);
        }
        
        if (_isIEListener()) { 
            _removeMultipleDetachEvent(el, type);
        }
        
        if (!_isIEListener() && !_isW3cListener()) { 
            el['on' + type] = null;
        }
    };
    
    var _isW3cListener = function(){
        return (typeof window.addEventListener === 'function');
    };
    
    var _isIEListener = function(){
        return (typeof document.attachEvent === 'function');
    };
    
    var _removeMultipleEventListener = function(element, eventName){
        if (!_eventManager.hasEvents(element, eventName)) return;
        
        var callbacks = element.events[eventName];
        for (var i = 0, len = callbacks.length; i < len; i++) {
            element.removeEventListener(eventName, callbacks[i], false);
        }
    };
    
    var _removeMultipleDetachEvent = function(element, eventName){
        if (!_eventManager.hasEvents(element, eventName)) return;
        
        var callbacks = element.events[eventName];
        for (var i = 0, len = callbacks.length; i < len; i++) {
            element.detachEvent('on' + eventName, callbacks[i]);
        }
    };
    
    return {
        add: add,
        remove: remove,
        hasEvents: hasEvents,
        fire: fire,
        stopDefault: stopDefault
    };

})();