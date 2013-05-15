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


    describe("when caching", function() {

        var testKey, testLabel, nonExistentKey, data, jsonTestKeyResponse;

        beforeEach(function() {
            testKey     = "testKey";
            testLabel   = "testLabel";
            jsonTestKeyResponse = '{"header":{},"query":{ "key":"testKey", "locale": "' + browserLocale+'"},"answer":{"text":"testLabel"}}';

            nonExistentKey = "nonexistent.key";
            data = {
                "key": testKey,
                "locale": browserLocale
            };

            CUORE.Bus = {};
            CUORE.Bus.emit = jasmine.createSpy("emit");
        });

        xit("initializes with an empty cache if none is provided", function() {

        });

        xit("can be initialized with a provided cache", function() {

        });

        it("fires a remote request if label key is not found in cache", function() {
            aLabelService._request = jasmine.createSpy("_request");

            aLabelService.execute('getLabel', { key: "nonexistent.key" });

            expect(aLabelService._request).toHaveBeenCalled();
        });

        it("stores label in cache after requesting it", function() {
            aLabelService.execute('getLabel', { key: 'testKey'});
            xhr.lastRequest().respond(200, {
                "Content-Type": "text/text"
            }, jsonTestKeyResponse);

            aLabelService.execute('getLabel', data);

            expect(xhr.getRequestsCount()).toEqual(1);
            var message = CUORE.Bus.emit.mostRecentCall.args[1];
            expect(message.getFromQuery("key")).toEqual("testKey");
            expect(message.getFromQuery("locale")).toEqual(browserLocale);
            expect(message.getFromAnswer("text")).toEqual("testLabel");
        });

        it("emits the event if the key is found in cache", function() {
            aLabelService.execute('getLabel', data);
            xhr.lastRequest().respond(200, {
                "Content-Type": "text/text"
            }, jsonTestKeyResponse);

            aLabelService.execute('getLabel', data);

            expect(CUORE.Bus.emit.callCount).toEqual(2);
            var message = CUORE.Bus.emit.mostRecentCall.args[1];
            expect(message.getFromQuery("key")).toEqual("testKey");
            expect(message.getFromQuery("locale")).toEqual(browserLocale);
            expect(message.getFromAnswer("text")).toEqual("testLabel");
        });
    });
});