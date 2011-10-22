CUORE.Journey = CUORE.Class(null, {

    init: function(start, end) {
        var allValues = (start && end);

        this.itsGranularity = 60;
        this.minutesInAnHour = 60;
        this.start = (allValues) ? this._convertToMinutesDay(start) : 0;
        this.end = (allValues) ? this._convertToMinutesDay(end) : 1440;
    },

    starts: function() {
        return this._normalize(this.start);
    },

    ends: function() {
        return this._normalize(this.end);
    },

    granularity: function() {
        return this.itsGranularity;
    },

    withGranularityOf: function(granularity) {
        this.itsGranularity = parseInt(granularity, 10);
    },

    isValid: function() {
        return (this.start < this.end);
    },

    slots: function() {
        var theSlots = [];
        var finalMinute = this.end - this.itsGranularity;
        var index = 0;
        
        for (var initialMinute = this.start; initialMinute <= finalMinute; initialMinute += this.itsGranularity) {
            var journeyStart = this._formatHour(initialMinute);
            var journeyEnd = this._formatHour(initialMinute + this.itsGranularity);
            theSlots[index++] = new CUORE.Journey(journeyStart, journeyEnd);
        }

        var lastSlotEnds = theSlots[index - 1].ends();
        if (lastSlotEnds !== this.ends()) {
            theSlots[index] = new CUORE.Journey(lastSlotEnds, this.ends());
        }

        return theSlots;
    },

    toString: function() {
        return this.starts() + '-' + this.ends();
    },

    setStartTime: function(hour) {
        if (!hour) return;

        this.start = this._convertToMinutesDay(hour);
        if (this.start >= this.end) {
            this.start = this.end - this.itsGranularity;
        }
    },

    setEndTime: function(hour) {
        if (!hour) return;

        this.end = this._convertToMinutesDay(hour);
        if (this.end <= this.start) {
            this.end = this.start + this.itsGranularity;
        }
    },
    
    _convertToMinutesDay: function(anHour) {
        var hoursInADay = 24;
        var hour = this._parseHour(anHour);
        var minutes = this._parseMinutes(anHour);
        var notValidMinute = (minutes >= this.minutesInAnHour) || (minutes < 0);
        var notValidHour = (hour > hoursInADay) || (hour < 0);

        if (notValidMinute || notValidHour) return null;

        return (hour * this.minutesInAnHour) + minutes;
    },
    
    _parseMinutes: function(anHour) {
        return (Number(this._getChunks(anHour)[1]) || 0);
    },
    
    _formatHour: function(minutes) {
        var firstNumberWith2Digits = 10;
        var hour = Math.floor(minutes / this.minutesInAnHour);
        var minutesLeft = (minutes % this.minutesInAnHour);
        var formatedMinutes = (minutesLeft < firstNumberWith2Digits) ? '0' + minutesLeft : minutesLeft;
        var formatedHour = (hour < firstNumberWith2Digits) ? '0' + hour : hour;

        return formatedHour + ':' + formatedMinutes;
    },
    
    _parseHour: function(anHour) {
        return Number(this._getChunks(anHour)[0]);
    },

    _getChunks: function(anHour) {
        var anHourString = anHour.toString();
        return anHourString.split(':', 2);
    },
    
    _normalize: function(hour) {
        if (!isNaN(hour)) {
            return this._formatHour(hour);
        }
    }
});