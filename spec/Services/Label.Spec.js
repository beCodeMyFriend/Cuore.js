describe("LabelsService", function() {

    var aLabelService;
    var baseURL = "http://www.google.com";
    var xhr, browserLocale;



    beforeEach(function() {
        browserLocale = (navigator.language || navigator.browserLanguage);
        document.labels = undefined;

        aLabelService = new CUORE.Services.Label();
        aLabelService.setBaseURL(baseURL);

        this.addMatchers(CUORE.Matchers);
        xhr = new CUORE.Helpers.Xhr();
    });

    afterEach(function() {
        xhr.restore();
    });


    it("inherits RemoteService", function() {
        expect(aLabelService).toBeInstanceOf(CUORE.Service);
        expect(aLabelService).toBeInstanceOf(CUORE.RemoteService);
        expect(aLabelService).toBeInstanceOf(CUORE.Services.Label);
    });

    it("uses browser locale as default", function() {
        expect(aLabelService.locale).toEqual(browserLocale);
    });

    it("can use any locale", function() {
        var expectedLocale = "aLocale";
        aLabelService.setLocale(expectedLocale);
        expect(aLabelService.locale).toEqual(expectedLocale);
    });

    it("calls request with correct URL endpoint", function() {
        var expectedURL = baseURL + "/labels/get";

        aLabelService.getLabel({
            "key": "tal"
        }, "testEvent");
        
        expect(xhr.lastRequest().url).toEqual(expectedURL);
    });

    it("prevents execution when key is not present", function() {
        var aBus = {};
        aBus.emit = jasmine.createSpy('emit');

        var labelService = new CUORE.Services.Label();
        labelService._request = jasmine.createSpy('_request');

        labelService.getBus = function() {
            return aBus;
        };

        labelService.getLabel(null, null);
        expect(aBus.emit).not.toHaveBeenCalled();
        expect(labelService._request).not.toHaveBeenCalled();

        labelService.getLabel({}, null);
        expect(aBus.emit).not.toHaveBeenCalled();
        expect(labelService._request).not.toHaveBeenCalled();
    });


    it("reads document.labels as internal cache when initialized", function() {
        document.labels = {};
        document.labels[browserLocale] = {
            "testKey": "testLabel"
        };
        var anotherService = new CUORE.Services.Label();
        expect(anotherService.cache).toEqual(document.labels);
    });


    describe("when caching", function() {

        var testKey,data;

        beforeEach(function() {
            testKey = "testKey";
            data = {
                "key": testKey,
                "locale": browserLocale
            };
            document.labels = {};
            document.labels[browserLocale] = {
                "testKey": "testLabel"
            };
        });
        
        it("uses an internal cache to save request calls", function() {
            var cacheExpected = {};
            cacheExpected[browserLocale] = {
                "testKey": "testLabel"
            };
            aLabelService.getLabel(data, "testEvent");
            var jsonMessage = '{"header":{},"query":{"key":"testKey"},"answer":{"text":"testLabel"}}';
            xhr.lastRequest().respond(200, {
                "Content-Type": "text/text"
            }, jsonMessage);

            expect(aLabelService.cache).toEqual(cacheExpected);
        });
        
        it("uses document.labels if cache is ok", function() {
            var labelService = new CUORE.Services.Label();
            labelService._request=jasmine.createSpy("_request");
            labelService.getLabel(data, "testEvent");

            expect(labelService._request).not.toHaveBeenCalled();
        });

        it("emits a correct message when retrieving from cache", function() {
            var labelService = new CUORE.Services.Label();
            CUORE.Bus = {};
            CUORE.Bus.emit = jasmine.createSpy('emit');
            labelService.getLabel(data, "testEvent");
            var theMessage = CUORE.Bus.emit.mostRecentCall.args[1];

            expect(theMessage.getFromQuery("key")).toEqual(testKey);
            expect(theMessage.getFromQuery("locale")).toEqual(browserLocale);

        });
    });
});