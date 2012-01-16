CUORE.Components.NumericSelector = CUORE.Class(CUORE.Components.Input, {

    init: function(key) {
        CUORE.Components.NumericSelector.parent.init.call(this, key);

        this.limSup = 999999999999999999999999;
        this.limInf = 0;
        this.incrementer = 1;
        this.setRenderer(new CUORE.Renderers.NumericSelector());
    },

    draw: function() {
        CUORE.Components.NumericSelector.parent.draw.call(this);
        
        this.setValue(this.getValue());
    },

    plus: function() {
        if (!this.isEnabled()) return;
        
        var value = parseInt(this.getValue(), 10) + this.incrementer;
        this.setValue(value);
    },

    minus: function() {
        if (!this.isEnabled()) return;
        
        var value = (this.getValue() - this.incrementer);
        this.setValue(value);
    },

    setValue: function(aValue) {
        var normalizedValue = this._normalizeValue(aValue);
        CUORE.Components.NumericSelector.parent.setValue.call(this, normalizedValue);
        
        this.updateRender();
        this.notifyChanges();
    },

    notifyChanges: function() {
        var bus = this.getBus();
        var dataValue = parseInt(this.getValue(), 10);
        var data = { value: dataValue };
        
        bus.emit('COMPONENT_' + this.name + '_CHANGED', data);
    },

    getBus: function() {
        return CUORE.Bus;
    }, // TODO SUT?

    setLimSup: function(newLimSup) {
        if (newLimSup < this.limInf) newlimSup = this.limInf;
        
        this.limSup = newLimSup;
        this.setValue(null);
    },

    getLimSup: function() {
        return this.limSup;
    },

    setLimInf: function(newLimInf) {
        if (newLimInf > this.limSup) newLimInf = this.limSup;

        this.limInf = newLimInf;
        this.setValue(null);
    },

    getLimInf: function() {
        return this.limInf;
    },

    setIncrementer: function(newIncrementer) {
        this.incrementer = newIncrementer;
    },
    
    _normalizeValue: function(value) {
        if (value === '') value = this.limInf;
        if (value === null) value = this.getValue();
          
        var normalizedValue = this._checkLimits(value);

        return normalizedValue;
    },

    _checkLimits: function(value) {
        if (value >= this.limSup) {
            value = this.limSup;
        }

        if (value <= this.limInf) {
            value = this.limInf;
        }

        return this._snap(value);
    },

    _snap: function(value) {
        return parseInt(value / this.incrementer, 10) * this.incrementer;
    }
});