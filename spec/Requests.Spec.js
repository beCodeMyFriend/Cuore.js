describe("Requests", function() {

	var data = {'id': '123',"title": "test"};
	var aServer,URL="http://localhost";

    beforeEach(function() {        
        this.addMatchers(CUORE.Matchers);
    });

	describe("GET",function() {

	    it("called the callback with json formatted response", function() {
	    	aServer = new CUORE.Helpers.Server();
	        aServer.startGET(URL,data);

	        var callback = jasmine.createSpy();
	        CUORE.Requests.get(URL, "", callback);

	        aServer.respond();
	       
	        expect(callback).toHaveBeenCalledWith(data);

	        aServer.restore();
	    });

	    it('should send the data in the url,escaping empty spaces and non url characters', function() {
	    	var aJsonInputData = {
	                'key': 'value',
	                'key2': 'a value2',
	                'key3': 'a&value'
	        };
	        var expectedSentUrl = URL + '?key=value&key2=a%20value2&key3=a%26value';
	        var callback = jasmine.createSpy();

	       	xhr = new CUORE.Helpers.Xhr();
	            
	        CUORE.Requests.get(URL, aJsonInputData, callback);

	        expect(xhr.lastRequest().url).toEqual(expectedSentUrl);

	        xhr.restore;
	    });
	});

	describe("POST",function() {

	    it("called the callback with json formatted request", function() {
	    	aServer = new CUORE.Helpers.Server();
	        aServer.startPOST(URL,data);

	        var callback = jasmine.createSpy();
	        CUORE.Requests.post(URL, data, callback);

	        aServer.respond();
	       
	        expect(callback).toHaveBeenCalledWith(data);

	        aServer.restore();
	    });
	});

	describe("JSONP",function() {

	    it("creates a script with the url in the Dom", function() {
	        var callbackName = CUORE.Requests.jsonp(URL, data, null);
	        var scripts = document.getElementsByTagName("script");
	        var lastScript = scripts[scripts.length - 1];

	        expect(lastScript.src).toEqual(URL + callbackName + "&id=123&title=test&");
	        expect(lastScript.id).toEqual(callbackName);
	    });

	    it("injects a function as callback and removes it once the call is completed", function() {
	        var aCallback = jasmine.createSpy('aCallback');
	        var callbackName = CUORE.Requests.jsonp(URL, data, aCallback);
	        var response = {"response": "test"};
	        window[callbackName](response);

	        expect(window[callbackName]).toBeFunction();

	        expect(aCallback).toHaveBeenCalledWith(response);

	        expect(document.getElementById(callbackName)).toEqual(undefined);
	    });
	});
});