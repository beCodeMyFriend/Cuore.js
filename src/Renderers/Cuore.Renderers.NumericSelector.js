CUORE.Renderers.NumericSelector = CUORE.Class(CUORE.Renderers.Input, {
    
    init: function () {
        CUORE.Renderers.NumericSelector.parent.init.call(this);
        
        this.valueDisplayed = null;
    },
    
    paint: function (component) {
        CUORE.Renderers.NumericSelector.parent.paint.call(this, component);

        this._decorateInput();
        this._addMinusButton(component);
        this._addPlusButton(component);
    },
    
    updateWhenDrawn: function (component) {
        CUORE.Renderers.NumericSelector.parent.updateWhenDrawn.call(this, component);

        this._checkDecorations(component);
    },

    _decorateInput: function () {
        CUORE.Dom.addClass(this.DOMInput, 'numericSelector');

        var clearFunction   = CUORE.Core.bind(this, this._clearInput);
        var restoreFunction = CUORE.Core.bind(this, this._restoreInput);

        CUORE.Dom.Event.add(this.DOMInput, 'focus', clearFunction);
        CUORE.Dom.Event.add(this.DOMInput, 'blur', restoreFunction);
    },
    
    _clearInput: function () {
        this.valueDisplayed = this.getValue();
        this.DOMInput.value = '';
    },

    _restoreInput: function () {
        var value = this.getValue();
        var checkValue = (this._isIncorrect(value) || !this._isInteger(value));

        this.DOMInput.value = (checkValue) ? this.valueDisplayed : value;
    },

    _addMinusButton: function (component) {
        var componentMinus = CUORE.Core.bind(component, component.minus);

        this.minusButton = CUORE.Dom.createElement('a', {
            href: '#',
            className: 'minusButton',
            innerHTML: '<span>-</span>'
        }, this.panel);

        CUORE.Dom.Event.stopDefault(this.minusButton, 'click');
        CUORE.Dom.Event.add(this.minusButton, 'click', componentMinus);
    },

    _addPlusButton: function (component) {
        var componentPlus = CUORE.Core.bind(component, component.plus);

        this.plusButton = CUORE.Dom.createElement('a', {
            href: '#',
            className: 'plusButton',
            innerHTML: '<span>+</span>'
        }, this.panel);

        CUORE.Dom.Event.stopDefault(this.plusButton, 'click');
        CUORE.Dom.Event.add(this.plusButton, 'click', componentPlus);
    },

    _checkDecorations: function (component) {
        var value = parseInt(this.getValue(), 10);
        var OFF   = 'off';
        
        CUORE.Dom.removeClass(this.plusButton, OFF);
        CUORE.Dom.removeClass(this.minusButton, OFF);
        
        if (!component.isEnabled()) {
           CUORE.Dom.addClass(this.plusButton, OFF);
           CUORE.Dom.addClass(this.minusButton, OFF);
        }

        if ((value + component.incrementer) > component.limSup) {
            CUORE.Dom.addClass(this.plusButton, OFF);
        }

        if ((value - component.incrementer) < component.limInf) {
            CUORE.Dom.addClass(this.minusButton, OFF);
        }
    },

    _isIncorrect: function (value) {
        var trimmedValue = value.replace(/^\s+|\s+$/g, '');
        var noNumber = isNaN(trimmedValue);
        var isEmpty = (!trimmedValue);
        
        return noNumber || isEmpty;
    },

    _isInteger: function (value) {
        var valueToInt = parseInt(value, 10);
        
        return !isNaN(valueToInt) && (parseFloat(value) === valueToInt);
    }
});