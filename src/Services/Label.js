CUORE.Services.Label = CUORE.Class(CUORE.RemoteService, {

    init: function() {
        CUORE.Services.Label.parent.init.call(this);
        this.name = 'LABELS';
        this.cache = new CUORE.Cache();
        this.setLocale(navigator.language || navigator.browserLanguage);
    },

    getLocale: function() {
        return this.locale;
    },

    setLocale: function(aLocale) {
        if (!aLocale) return;
        this.locale = aLocale;
        this.cache.initLocale(this.locale);
    },

    getLabel: function(params, eventName) {
        if (!(params && params.key)) return;

        var cachedLabel = this.fromCache(params.key);


        if (cachedLabel) {
            var cachedResponse = new CUORE.Message();
            cachedResponse.putMapOnQuery(params);
            cachedResponse.putOnAnswer('text', cachedLabel);
            CUORE.Services.Label.parent._emit.call(this, eventName, cachedResponse.asJson());
        } else {
            if (!params.locale) params.locale = this.locale;
            this._request('get', params, eventName);
        }
    },

    fromCache: function(key) {
        return this.cache.fromCache(this.locale,key);
    },

    feedCache: function(theKey, value) {
        this.cache.feedCache(this.locale,theKey, value);
    },

    _emit: function(eventName, response) {
        var theMessage = new CUORE.Message(response);
        var theKey = theMessage.getFromQuery('key');
        if (!theKey) return;
        var text = theMessage.getFromAnswer('text');
        this.feedCache(theKey, text);
        text = text || theKey;
        theMessage.putOnAnswer('text', text);

        CUORE.Services.Label.parent._emit.call(this, eventName, theMessage.asJson());
    },

    feed: function(cache) {
        this.cache.feed(cache);
    },

    extractKey: function(eventName) {
        var match = eventName.match(/_([a-zA-Z\.]*)$/);
        var theKey = match ? match[1] : null;

        return theKey;
    }
});