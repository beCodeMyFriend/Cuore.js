CUORE.Message = CUORE.Class(null, {

    init: function(json) {
        this.header = {};
        this.query = {};
        this.answer = {};
        
        this._parse(json);
    },

    asJson: function() {
        var structure = {};
        structure.header = this.header;
        structure.query = this.query;
        structure.answer = this.answer;

        return JSON.stringify(structure); // TODO
    },

    putOnHeader: function(key, value) {
        value && (this.header[key] = value);
    },

    getFromHeader: function(key) {
        return this.header[key] || '';
    },

    removeFromHeader: function(key) {
        delete this.header[key];
    },

    putOnQuery: function(key, value) {
        value && (this.query[key] = value);
    },

    putMapOnQuery: function(map) {
        this._processMap(map, this.putOnQuery);
    },
    
    putOnAnswer: function(key, value) {
        value && (this.answer[key] = value);
    },

    putMapOnAnswer: function(map) {
        this._processMap(map, this.putOnAnswer);
    },

    getFromQuery: function(key) {
        return this.query[key] || '';
    },

    removeFromQuery: function(key) {
        delete this.query[key];
    },

    getFromAnswer: function(key) {
        return this.answer[key] || '';
    },

    removeFromAnswer: function(key) {
        delete this.answer[key];
    },
    
    _parse: function(json) {
        var isString = (typeof json === 'string');

        if (json && isString) {
            var parsed  = JSON.parse(json); // TODO
            this.header = this._removeNulls(parsed.header);
            this.query  = this._removeNulls(parsed.query);
            this.answer = this._removeNulls(parsed.answer);
        }
    },
    
    _processMap: function(map, method) {
        for (var key in map) {
            if (CUORE.Core.isOwnProperty(map, key)) {
                method.call(this, key, map[key]);
            }
        }
    },
    
    _removeNulls: function(filtered) {
        for (var key in filtered) {
            if (CUORE.Core.isOwnProperty(filtered, key) && !filtered[key]) {
                delete filtered[key];
            }
        }
        return filtered;
    }
});