CUORE.Components.TimeRange = CUORE.Class(CUORE.Component, {

    init: function(key, granularity) {
        CUORE.Components.TimeRange.parent.init.call(this);

        this.label = null;
        this.startHourSelect = null;
        this.endHourSelect = null;
        this.setRenderer(new CUORE.Renderers.TimeRange());
        this.journey = new CUORE.Journey();
        this.setI18NKey(key);

        if (granularity) {
            this.journey.withGranularityOf(granularity);
        }
    },

    setStartHour: function(hour) {
        if (!hour || typeof hour === "object") {
            hour = this.renderer.getStartTime();
        }

        this.journey.setStartTime(hour);
        this.updateRender();
        this.emitValues();
    },

    setEndHour: function(hour) {
        if (!hour || typeof hour === "object") {
            hour = this.renderer.getEndTime();
        }

        this.journey.setEndTime(hour);
        this.updateRender();
        this.emitValues();
    },

    setText: function(aText) {
        this.text = aText;
        this.updateRender();
    },

    emitValues: function() {
        var params = {
            'startHour': this.getStartHour(),
            'endHour': this.getEndHour()
        };
        this.getBus().emit('COMPONENT_' + this.name + '_CHANGED', params);
    },

    getStartHour: function() {
        return this.journey.starts();
    },

    getEndHour: function() {
        return this.journey.ends();
    },

    getBus: function() {
        return CUORE.Bus;
    }
});
