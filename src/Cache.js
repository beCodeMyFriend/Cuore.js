CUORE.Cache = CUORE.Class(null, {

    init: function() {
        this.cache = {};
    },

    initLocale: function(locale) {
        this.cache[locale] = this.cache[locale] || {};
    },

    fromCache: function(locale, key) {
        return this.cache[locale][key];
    },

    feedCache: function(locale, theKey, value) {
        if (value) {
            this.cache[locale][theKey] = value;
        }
    },
    
    feed: function(cache) {
        this.cache = cache || {};
    },

});