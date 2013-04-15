CUORE.Dom = (function(doc, undefined) {

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
            element.className += ' ' + cssClass;
        }
    };

    var removeClass = function(element, cssClass) {
        _checkElement(element);
        if (hasClass(element, cssClass)) {
            var currentClasses = _allClasses(cssClass);
            element.className = element.className.replace(currentClasses, ' ').replace(/\s+/g, ' ').replace(/^\s|\s$/, '');
        }
    };

    var hasClass = function(element, cssClass) {
        _checkElement(element);
        var currentClasses = _allClasses(cssClass);
        var matchedClasses = element.className.match(currentClasses);
        var result = false;

        if (matchedClasses != null) result = true;

        return result;
    };

    var createElement = function(name, members, parent) {
        var elem = doc.createElement(name);

        if (CUORE.Core.toType(members) === 'object') {
            for (var m in members) {
                if (CUORE.Core.isOwnProperty(members, m)) {
                    elem[m] = members[m];
                }
            }
        }

        parent && parent.appendChild && parent.appendChild(elem);

        return elem;
    };

    var _allClasses = function(cssClass) {
        return new RegExp('(\\s|^)' + cssClass + '(\\s|$)');
    };

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