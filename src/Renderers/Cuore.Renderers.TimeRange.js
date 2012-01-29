CUORE.Renderers.TimeRange = CUORE.Class(CUORE.Renderer, {

    init: function() {
        CUORE.Renderers.TimeRange.parent.init.call(this);

        this.label = null;
        this.startHourSelect = null;
        this.endHourSelect = null;
    },

    paint: function(component) {
        CUORE.Renderers.TimeRange.parent.paint.call(this, component);

        var componentSetStartHour = CUORE.Core.bind(component, component.setStartHour);
        var componentSetEndHour = CUORE.Core.bind(component, component.setEndHour);

        this.panel.innerHTML = null;
        this.addClass('timeRange');

        this.label = CUORE.Dom.createElement('label', null, this.panel);

        this.startHourSelect = CUORE.Dom.createElement('select', {
            className: 'hourSelect startHourSelect'
        }, this.panel);

        CUORE.Dom.Event.add(this.startHourSelect, 'change', componentSetStartHour);

        this.endHourSelect = CUORE.Dom.createElement('select', {
            className: 'hourSelect endHourSelect'
        }, this.panel);

        CUORE.Dom.Event.add(this.endHourSelect, 'change', componentSetEndHour);

        this.showDisabledState(component);
    },

    updateWhenDrawn: function(component) {
        this._setOptions(component);

        this.showDisabledState(component);
        this.label.innerHTML = component.getText();
        this.startHourSelect.value = component.journey.starts();
        this.endHourSelect.value   = component.journey.ends();
    },

    showDisabledState:function(component) {
        CUORE.Renderers.TimeRange.parent.showDisabledState.call(this,component);

        if (!this.startHourSelect || !this.endHourSelect) return;
        this.startHourSelect.disabled = !component.isEnabled();
        this.endHourSelect.disabled = !component.isEnabled();
    },

    getStartTime: function() {
        return this._getTimeByProperty('start');
    },

    getEndTime: function() {
        return this._getTimeByProperty('end');
    },

    _setOptions: function(component) {
        var granularity  = component.journey.granularity();
        var startOptions = ['00:00', component.journey.ends(), granularity];
        var endOptions   = [component.journey.starts(), '24:00', granularity];

        this._constructOptionsByProperty('start', startOptions);
        this._constructOptionsByProperty('end', endOptions);
    },

    _constructOptionsByProperty: function(property, slotsOptions) {
        var slots   = this._getSlots.apply(null, slotsOptions);
        var element = this[property + 'HourSelect'];
        this._clearOptions(element);

        for (var i = 0, len = slots.length; i < len; i++) {
            var slot = slots[i][property + 's']();

            CUORE.Dom.createElement('option', {
                value: slot,
                text: slot
            }, element);
        }
    },

    _getSlots: function(start, end, granularity) {
        var aJourney = new CUORE.Journey(start, end);
        aJourney.withGranularityOf(granularity);

        return aJourney.slots();
    },

    _clearOptions: function(selectElement) {
        selectElement.options.length = 0;
    },

    _getTimeByProperty: function(property) {
        var element = this[property + 'HourSelect'];

        return element.options[element.selectedIndex].value;
    }
});
