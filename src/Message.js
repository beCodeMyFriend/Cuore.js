CUORE.Message = CUORE.Class(null, {

    init: function(content) {
        this._initialize();
        this._build(content);
    },

    asJson: function() {
        var structure = this._wrapProperties();
        return JSON.stringify(structure);
    },

    putOnHeader: function(key, value) {
        if (value === null) return;
        this.header[key] = value;
    },

    putOnQuery: function(key, value) {
        if (value === null) return;
        this.query[key] = value;
    },

    putOnAnswer: function(key, value) {
        if (value === null) return;
        this.answer[key] = value;
    },

    getFromHeader: function(key) {
        return this.header[key];
    },

    getFromQuery: function(key) {
        return this.query[key];
    },

    getFromAnswer: function(key) {
        return this.answer[key];
    },

    putMapOnQuery: function(map) {
        this._processMap(map, this.putOnQuery);
    },

    putMapOnAnswer: function(map) {
        this._processMap(map, this.putOnAnswer);
    },

    _wrapProperties: function() {
        return {
            "header": this.header,
            "query": this.query,
            "answer": this.answer
        };
    },

    _initialize: function() {
        this.header = {};
        this.query = {};
        this.answer = {};
    },

    _build: function(content) {
        if (!content) return;

        var parsed = this._parse(content);

        this.header = this._removeNulls(parsed.header);
        this.query = this._removeNulls(parsed.query);
        this.answer = this._removeNulls(parsed.answer);
    },

    _parse: function(content) {
        if (typeof content !== 'string') return content;
        return JSON.parse(content);
    },

    _processMap: function(map, method) {
        for (var key in map) {
            if (CUORE.Core.isOwnProperty(map, key)) {
                method.call(this, key, map[key]);
            }
        }
    },

    _removeNulls: function(toFilter) {
        for (var key in toFilter) {
            var keyExists = CUORE.Core.isOwnProperty(toFilter, key);
            var toRemove = keyExists && (toFilter[key] === null)
            if (toRemove) delete toFilter[key];
        }
        return toFilter;
    }
});