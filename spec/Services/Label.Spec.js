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

    it("uses browser's locale as default locale", function() {
        expect(aLabelService.getLocale()).toEqual(browserLocale);
    });

    it("can use a particular locale", function() {
        var expectedLocale = "aLocale";

        aLabelService.setLocale(expectedLocale);

        expect(aLabelService.getLocale()).toEqual(expectedLocale);
    });

    it("calls request with correct URL endpoint", function() {
        var expectedURL = baseURL + "/labels/get";

        aLabelService.getLabel({
            "key": "tal"
        }, "testEvent");
        
        expect(xhr.lastRequest().url).toEqual(expectedURL);
    });

    it("prevents emission of the event if data is null", function() {
        CUORE.Bus = {};
        CUORE.Bus.emit = jasmine.createSpy("emit");

        aLabelService.execute('getLabel', null);

        expect(CUORE.Bus.emit).not.toHaveBeenCalled();
    });

    it("prevents emission of the event if key is null", function() {
        CUORE.Bus = {};
        CUORE.Bus.emit = jasmine.createSpy("emit");

        aLabelService.execute('getLabel', {key: null});

        expect(CUORE.Bus.emit).not.toHaveBeenCalled();
    });


    xit("prevents emission of the event if key is not found", function() {
        CUORE.Bus = {};
        CUORE.Bus.emit = jasmine.createSpy("emit");

        aLabelService.execute('getLabel', { key: "nonexistent.key"});

        expect(CUORE.Bus.emit).not.toHaveBeenCalled();
    });

    it("prevents remote request if event data is null", function() {
        aLabelService._request = jasmine.createSpy("_request");

        aLabelService.execute('getLabel', null);

        expect(aLabelService._request).not.toHaveBeenCalled();
    });

    it("prevents remote request if event key is null", function() {
        aLabelService._request = jasmine.createSpy("_request");

        aLabelService.execute('getLabel', {key: null});

        expect(aLabelService._request).not.toHaveBeenCalled();
    });

    it("makes a remote request if label key is not found in cache", function() {
        aLabelService._request = jasmine.createSpy("_request");

        aLabelService.execute('getLabel', { key: "nonexistent.key" });

        expect(aLabelService._request).toHaveBeenCalled();
    });

    it("stores label in cache", function() {

    });

    xit("reads document.labels as internal cache when initialized", function() {
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
        
        xit("uses an internal cache to save request calls", function() {
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
        
        xit("uses document.labels if cache is ok", function() {
            var labelService = new CUORE.Services.Label();
            labelService._request=jasmine.createSpy("_request");
            labelService.getLabel(data, "testEvent");

            expect(labelService._request).not.toHaveBeenCalled();
        });

        xit("emits a correct message when retrieving from cache", function() {
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