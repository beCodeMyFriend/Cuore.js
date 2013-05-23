CUORE.Services.Label = CUORE.Class(CUORE.RemoteService, {

    init: function() {
        CUORE.Services.Label.parent.init.call(this);
        this.name = 'LABELS';
        this.cache = new CUORE.Cache();
        this.setLocale(navigator.language || navigator.browserLanguage);
    },

    execute: function(procedure, data) {
        var eventName = this._getEventName(procedure);
        var cachedMessage = this.cache.getFromCache(data);
        if (cachedMessage) {
            CUORE.Services.Label.parent._emit.call(this, eventName, cachedMessage.asJson());
        } else {
            this[procedure](data, eventName);
        }
    },

    getLocale: function() {
        return this.locale;
    },

    setLocale: function(aLocale) {
        if (!aLocale) return;
        this.locale = aLocale;
    },

    getLabel: function(params, eventName) {
        if (!(params && params.key)) return;
        if (!params.locale) params.locale = this.locale;
        this._request('get', params, eventName);
    },

    _emit: function(eventName, response) {
        var theMessage = new CUORE.Message(response);
        var theKey = theMessage.getFromQuery('key');
        if (!theKey) return;
        var text = theMessage.getFromAnswer('text');
        text = text || theKey;
        theMessage.putOnAnswer('text', text);
        CUORE.Services.Label.parent._emit.call(this, eventName, theMessage.asJson());

        this.cache.putOnCache(theMessage);
    },

    feed: function(cache) {
        for (var locale in cache) {
            var theLocaleMap = cache[locale];
            for (var key in theLocaleMap) {
                var theLabel = theLocaleMap[key];
                var data = {
                    "key": key,
                    "locale": locale
                };
                var theMessage = new CUORE.Message();
                theMessage.putMapOnQuery(data);
                theMessage.putOnAnswer("text",theLabel);
                this.cache.putOnCache(theMessage);
            }
        }
    }

});