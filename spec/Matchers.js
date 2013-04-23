CUORE.Matchers = {
    toBeInstanceOf: function(expectedType) {
        var actual = this.actual;
        this.message = function() {
            return actual + " isn't an instance of expected type";
        }
        return actual instanceof expectedType;
    },
    
    toBeFunction: function() {
        var actual = this.actual;
        this.message = function() {
            return actual + " isn't a function";
        }
        return typeof actual === 'function';
    },
    
    toContainAnElement: function(HTMLElementType) {
        var figures = this.actual.getElementsByTagName(HTMLElementType);
        return (figures.length > 0);
    },

    toContainClass: function(classname) {
        return CUORE.Dom.hasClass(this.actual, classname);
    },

    toHaveBeenCalledWithAHandlerForEvent: function(expectedEventName) {
        var spy = this.actual;
        var mostRecentCall = spy.mostRecentCall;
        var supposedToBeAHandler = mostRecentCall.args[1];
        return mostRecentCall.args[0] == expectedEventName && supposedToBeAHandler && typeof supposedToBeAHandler == 'object' && typeof supposedToBeAHandler.handle == 'function';
    }

};