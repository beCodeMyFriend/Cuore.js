CUORE.Dom = (function(doc, undefined) {
    var _SPACE='';

    var ready = function(callback) {
        var checkLoaded = setInterval(function() {
            if (doc.body && doc.getElementById) {
                clearInterval(checkLoaded);
                callback();
            }
        }, 10);
    };

    var addClass = function(element, cssClass) {
        _checkElement(element);
        if (!hasClass(element, cssClass)) {
            element.className += _SPACE + cssClass;
        }
    };

    var removeClass = function(element, cssClass) {
        _checkElement(element);
        if (hasClass(element, cssClass)) {
            element.className = _deleteClassname(element.className,cssClass);
            element.className = _removeExtraSpace(element.className);
        }
    };
    

    var hasClass = function(element, cssClass) {
        _checkElement(element);
        var classToMatchRegexp = _allClasses(cssClass);
        var matchedClasses = element.className.match(classToMatchRegexp);
        return matchedClasses;
    };

    var createElement = function(name, attributes, parent) {
        var elem = doc.createElement(name);

        if (CUORE.Core.toType(attributes) === 'object') {
            for (var m in attributes) {
                if (CUORE.Core.isOwnProperty(attributes, m)) {
                    elem[m] = attributes[m];
                }
            }
        }

        parent && parent.appendChild && parent.appendChild(elem);
        return elem;
    };

    var _allClasses = function(cssClass) {
        return new RegExp('(\\s|^)' + cssClass + '(\\s|$)');
    };

    var _deleteClassname = function(actualClasses, cssClass){
        var classToRemoveRegexp = _allClasses(cssClass);
        return actualClasses.replace(classToRemoveRegexp, ' ');
    }

    var _removeExtraSpace = function(actualClasses){
        var compressSpacesRegexp = /\s+/g;
        var trimRegexp = /^\s|\s$/;
        actualClasses.replace(compressSpacesRegexp, ' ')
        actualClasses.replace(trimRegexp,'');
        return actualClasses;
    }
    var _checkElement = function(element) {
        if (!(element instanceof HTMLElement)) throw ('Must be an HTMLElement');
    };

    return {
        ready: ready,
        addClass: addClass,
        removeClass: removeClass,
        hasClass: hasClass,
        createElement: createElement
    };

})(document);