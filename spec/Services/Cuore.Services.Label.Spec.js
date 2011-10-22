describe("LabelsService", function() {

    it("inheris Service", function() {
        var aLabelService = new CUORE.Services.Label();

        expect(aLabelService instanceof CUORE.Service).toBeTruthy();
        expect(aLabelService instanceof CUORE.Services.Label).toBeTruthy();
    });

    it("handles locale", function() {
        var aLabelService = new CUORE.Services.Label();
        var browserLocale = (navigator.language || navigator.browserLanguage);
        var expectedLocale = "aLocale";

        expect(aLabelService.locale).toEqual(browserLocale);

        aLabelService.setLocale(expectedLocale);
        expect(aLabelService.locale).toEqual(expectedLocale);
    });

    it("calls request with correct eventName and params and baseURL when getLabel executed", function() {
        var labelService = new CUORE.Services.Label();
        var browserLocale = (navigator.language || navigator.browserLanguage);


        var testEvent = "test_Event";
        var testKey = "testKey";

        var eventNameExpected = testEvent + labelService.SEPARATOR + testKey;

        var paramsSent = {
            "key": testKey,
            "locale": browserLocale
        };

        var baseURL = "http://baseurl";

        var expectedURL = baseURL + "/labels/get";
        labelService.setBaseURL(baseURL);


        spyOn(labelService, "request");

        labelService.getLabel(paramsSent, testEvent);

        expect(labelService.request).toHaveBeenCalledWith(expectedURL, paramsSent, eventNameExpected);
    });

    it("uses an internal cache to save request calls", function() {
        document.labels = undefined;
        var baseURL = "http://baseurl";
        var labelService = new CUORE.Services.Label();
        labelService.setBaseURL(baseURL);

        var browserLocale = (navigator.language || navigator.browserLanguage);
        var testKey = "testKey";
        var testParams = {
            "key": testKey,
            "locale": browserLocale
        };

        var testEvent = "test_Event";
        var eventNameExpected = testEvent + labelService.SEPARATOR + testKey;

        var expectedLabel = "testLabel";
        var messageExpected = new CUORE.Message();
        messageExpected.putOnQuery("key", testKey);
        messageExpected.putOnQuery("locale", browserLocale);
        messageExpected.putOnAnswer("text", expectedLabel);

        var aBus = {};
        aBus.emit = function(event, params) {};
        spyOn(labelService, "getBus").andReturn(aBus);
        spyOn(aBus, "emit");

        var mocketRequest = function(url, params, eventName) {
            this.emit(eventName, messageExpected.asJson());
        };
        spyOn(labelService, "request").andCallFake(mocketRequest);

        var cacheExpected = {};
        cacheExpected[browserLocale] = {
            "testKey": "testLabel"
        };
        labelService.getLabel(testParams, testEvent);

        expect(aBus.emit.mostRecentCall.args[0]).toEqual(eventNameExpected);
        expect(labelService.request.mostRecentCall.args[2]).toEqual(eventNameExpected);
        expect(labelService.cache).toEqual(cacheExpected);

        labelService.request.reset();
        labelService.getLabel(testParams, testEvent);
        expect(labelService.request.mostRecentCall).toEqual({});
        expect(aBus.emit.mostRecentCall.args[0]).toEqual(eventNameExpected);

        document.labels = undefined;
    });

    it("reads document.labels as internal cache when initialized", function() {
        document.labels = undefined;

        var browserLocale = (navigator.language || navigator.browserLanguage);

        var service = new CUORE.Services.Label();
        var expectedCache = {};
        expectedCache[browserLocale] = {};
        expect(service.cache).toEqual(expectedCache);

        document.labels = {};
        document.labels[browserLocale] = {
            "testKey": "testLabel"
        };

        var anotherService = new CUORE.Services.Label();
        expect(anotherService.cache).toEqual(document.labels);
        document.labels = undefined;
    });

    it("can use (.) symbol in the name of the keys", function() {
        document.labels = undefined;
        var baseURL = "http://baseurl";
        var labelService = new CUORE.Services.Label();
        labelService.setBaseURL(baseURL);

        var browserLocale = (navigator.language || navigator.browserLanguage);
        var testKey = "testKey.test";
        var testParams = {
            "key": testKey,
            "locale": browserLocale
        };

        var testEvent = "test_Event";
        var eventNameExpected = testEvent + labelService.SEPARATOR + testKey;

        var expectedLabel = "testLabel";
        var messageExpected = new CUORE.Message();
        messageExpected.putOnQuery("key", testKey);
        messageExpected.putOnQuery("locale", browserLocale);
        messageExpected.putOnAnswer("text", expectedLabel);

        var aBus = {};
        aBus.emit = function(event, params) {};
        spyOn(labelService, "getBus").andReturn(aBus);
        spyOn(aBus, "emit");

        var mocketRequest = function(url, params, eventName) {
            this.emit(eventName, messageExpected.asJson());

        };
        spyOn(labelService, "request").andCallFake(mocketRequest);

        var cacheExpected = {};
        cacheExpected[browserLocale] = {
            "testKey": "testLabel"
        };
        labelService.getLabel(testParams, testEvent);

        expect(aBus.emit.mostRecentCall.args[1]).toEqual(messageExpected);
        document.labels = undefined;
    });

    it("getLabel method calls with 404 requests returns key without caching", function() {
        var aBus = {};
        aBus.answer = undefined;
        aBus.emit = function(event, message) {
            this.answer = message.getFromAnswer("text");
        };

        var labelService = new CUORE.Services.Label();
        labelService.getBus = function() {
            return aBus;
        };
        var testKey = "UnexistentKey";
        var testEvent = "test_Event";
        var eventNameExpected = testEvent + labelService.SEPARATOR + testKey;

        labelService.emit(eventNameExpected, undefined);
        expect(aBus.answer).toEqual(testKey);

        var expectedCache = {};
        var browserLocale = (navigator.language || navigator.browserLanguage);
        expectedCache[browserLocale] = {};
        expect(labelService.cache).toEqual(expectedCache);
    });

    it("has a fail safe if documentLabels has bad cache", function() {
        document.labels = {};
        var testKey = "test.Key";
        var testLabel = "testLabel";
        var testParams = {
            "key": testKey
        };
        var labelInCache = false;

        var labelService = new CUORE.Services.Label();

        aBus = {};
        aBus.emit = function(event, params) {};

        labelService.getBus = function() {
            return aBus;
        };

        labelService.request = function(url, params, eventName) {
            labelInCache = true;
        };

        labelService.getLabel(testParams, "testEvent");

        expect(labelInCache).toBeTruthy();
    });

    it("uses document.labels if cache is ok", function() {
        document.labels = {};
        var browserLocale = (navigator.language || navigator.browserLanguage);
        document.labels[browserLocale] = {
            "test.Key": "testLabel"
        };

        var testKey = "test.Key";
        var testLabel = "testLabel";
        var testParams = {
            "key": testKey
        };

        var labelInCache = true;

        var labelService = new CUORE.Services.Label();

        aBus = {};
        aBus.emit = function(event, params) {};

        labelService.getBus = function() {
            return aBus;
        };

        labelService.request = function(url, params, eventName) {
            labelInCache = false;
        };

        labelService.getLabel(testParams, "testEvent");

        expect(labelInCache).toBeTruthy();
    });

    it("emits a message which query containing key and locale and answer contains the label"), function() {
        var baseURL = "http://baseurl";

        var labelService = new CUORE.Services.Label();
        labelService.setBaseURL(baseURL);
        var browserLocale = (navigator.language || navigator.browserLanguage);
        var testEvent = "test_Event";
        var testKey = "testKey";
        var expectedLabel = "testLabel";
        var testParams = {
            "key": testKey,
            "locale": browserLocale
        };
        var eventNameExpected = testEvent + labelService.SEPARATOR + testKey;
        var messageExpected = new CUORE.Message('{"header":{},"query":{"key":"' + testKey + '","locale":"' + browserLocale + '"},"answer":{"text":"testLabel"}}');

        var aBus = {};
        aBus.emit = function(event, params) {}
        spyOn(labelService, "getBus").andReturn(aBus);


        spyOn(labelService, "request").andCallFake(function(url, params, eventName) {
            this.emit(eventName, messageExpected.asJson())
        });

        spyOn(aBus, "emit");
        labelService.getLabel(testParams, testEvent);
        expect(aBus.emit).toHaveBeenCalledWith(eventNameExpected, messageExpected);
    };
});