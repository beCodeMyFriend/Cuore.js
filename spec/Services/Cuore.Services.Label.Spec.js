describe("LabelsService", function() {

    var aLabelService;
    var baseURL = "http://www.google.com";
    var requests, xhr, browserLocale;


    beforeEach(function() {
        browserLocale = (navigator.language || navigator.browserLanguage);
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];
        xhr.onCreate = function(xhr) {
            requests.push(xhr);
        };

        CUORE.Core.createXHR = function() {
            return xhr;
        };

        document.labels = undefined;
        aLabelService = new CUORE.Services.Label();
        aLabelService.setBaseURL(baseURL);

        this.addMatchers({
            toBeInstanceOf: CUORE.Matchers.toBeInstanceOf
        });
    });

    afterEach(function() {
        xhr.restore();
    });

    it("inherits Service", function() {
        expect(aLabelService).toBeInstanceOf(CUORE.Service);
        expect(aLabelService).toBeInstanceOf(CUORE.Services.Label);
    });

    it("handles locale", function() {
        var expectedLocale = "aLocale";

        expect(aLabelService.locale).toEqual(browserLocale);

        aLabelService.setLocale(expectedLocale);
        expect(aLabelService.locale).toEqual(expectedLocale);
    });

    it("calls request with correct eventName composed with the key retrieved", function() {

        var testEvent = "test_Event";
        var testKey = "testKey";
        var paramsSent = {
            "key": testKey
        };
        var eventNameExpected = testEvent + aLabelService.SEPARATOR + testKey;

        spyOn(aLabelService, "request");

        aLabelService.getLabel(paramsSent, testEvent);
        eventName = aLabelService.request.mostRecentCall.args[2];

        expect(eventName).toEqual(eventNameExpected);
    });

    it("calls request with correct URL endpoint", function() {
        var expectedURL = baseURL + "/labels/get";

        spyOn(aLabelService, "request");

        aLabelService.getLabel({}, "testEvent");
        URLCalled = aLabelService.request.mostRecentCall.args[0];

        expect(URLCalled).toEqual(expectedURL);
    });


    it("uses an internal cache to save request calls", function() {

        var testKey = "testKey";
        var params = {
            "key": testKey,
            "locale": browserLocale
        };

        var cacheExpected = {};
        cacheExpected[browserLocale] = {
            "testKey": "testLabel"
        };

        aLabelService.getLabel(params, "testEvent");
        var jsonMessage = '{"header":{},"query":{},"answer":{"text":"testLabel"}}';
        lastRequest().respond(200, {
            "Content-Type": "text/text"
        }, jsonMessage);

        expect(aLabelService.cache).toEqual(cacheExpected);
    });

    it("reads document.labels as internal cache when initialized", function() {
        document.labels = {};
        document.labels[browserLocale] = {
            "testKey": "testLabel"
        };
        var anotherService = new CUORE.Services.Label();
        expect(anotherService.cache).toEqual(document.labels);
    });

    it("can use (.) symbol in the name of the keys", function() {
        var testKey = "test.Key";
        var params = {
            "key": testKey,
            "locale": browserLocale
        };

        var cacheExpected = {};
        cacheExpected[browserLocale] = {
            "test.Key": "testLabel"
        };

        aLabelService.getLabel(params, "testEvent");
        var jsonMessage = '{"header":{},"query":{},"answer":{"text":"testLabel"}}';
        lastRequest().respond(200, {
            "Content-Type": "text/text"
        }, jsonMessage);

        expect(aLabelService.cache).toEqual(cacheExpected);
    });

    it("prevents execution when key is not present", function() {
        var aBus = {};
        aBus.emit = jasmine.createSpy('emit');

        var labelService = new CUORE.Services.Label();
        labelService.request = jasmine.createSpy('request');

        labelService.getBus = function() {
            return aBus;
        };

        labelService.getLabel(null, null);
        expect(aBus.emit).not.toHaveBeenCalled();
        expect(labelService.request).not.toHaveBeenCalled();

        labelService.getLabel({}, null);
        expect(aBus.emit).not.toHaveBeenCalled();
        expect(labelService.request).not.toHaveBeenCalled();
    });

    it("getLabel method returns key as text without caching when inexistent key ", function() {
        var testKey = "testKey";
        var params = {
            "key": testKey,
            "locale": browserLocale
        };

        spyOn(CUORE.Bus, "emit");
        var oldCache = aLabelService.cache;
        aLabelService.getLabel(params, "testEvent");
        lastRequest().respond(200, {}, "");

        var message = CUORE.Bus.emit.mostRecentCall.args[1];
        expect(message.getFromAnswer('text')).toEqual(testKey);
        expect(aLabelService.cache).toEqual(oldCache);
    });


    it("uses document.labels if cache is ok", function() {
        document.labels = {};
        document.labels[browserLocale] = {
            "test.Key": "testLabel"
        };

        var testKey = "test.Key";
        var testLabel = "testLabel";
        var testParams = {
            "key": testKey,
            "locale" : browserLocale
        };
        
        var labelService = new CUORE.Services.Label();
        spyOn(labelService,"request");
        labelService.getLabel(testParams, "testEvent");

        expect(labelService.request).not.toHaveBeenCalled();
    });

    it("emits a correct message when retrieving from cache", function() {
       document.labels = {};
        document.labels[browserLocale] = {
            "test.Key": "testLabel"
        };

        var testKey = "test.Key";
        var testLabel = "testLabel";
        var testParams = {
            "key": testKey,
            "locale" : browserLocale
        };
        
        var labelService = new CUORE.Services.Label();
        spyOn(CUORE.Bus,"emit");
        labelService.getLabel(testParams, "testEvent");
        var theMessage = CUORE.Bus.emit.mostRecentCall.args[1];
        
        expect(theMessage.getFromQuery("key")).toEqual(testKey);
        expect(theMessage.getFromQuery("locale")).toEqual(browserLocale);
        
    });


    var lastRequest = function() {
            var last = requests[requests.length - 1];
            return last;
        };
});