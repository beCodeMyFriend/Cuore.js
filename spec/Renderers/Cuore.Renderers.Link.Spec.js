describe("Link Renderer", function () {
    
    afterEach(function(){
        var container = document.getElementById('xhtmlToTest');
        container.innerHTML = '';
    });
   
    it("inherits Renderer", function () {
        var aLink = new CUORE.Renderers.Link();

        expect(aLink instanceof CUORE.Renderers.Link).toBeTruthy();
        expect(aLink instanceof CUORE.Renderer).toBeTruthy();
    });

    it("generates an anchor in DOM with a span for css replacement when it is drawn", function () {
        var container = createTestContainer();

        var aDOMClass = "aCssClass";
	var aComponent = getDummyComponent();
	var aLink = new CUORE.Renderers.Link();
	aLink.setContainer(container.id);
	aLink.addClass(aDOMClass);
	aLink.render(aComponent);
	
        var DOMElement = document.getElementById(container.id);
	var anchor = DOMElement.getElementsByTagName('a')[0];
        expect(anchor.tagName).not.toBeUndefined();

        var innerSpan = anchor.getElementsByTagName('span')[0];
        expect(innerSpan).toBeDefined();
        expect(innerSpan.innerHTML).toEqual("anyText");

        expect(CUORE.Dom.hasClass(DOMElement, aDOMClass)).toBeTruthy();
    });

    it("generates an anchor with the url supplied", function () {
        var container = createTestContainer();

        var aDOMClass  = "aCssClass";
	var aComponent = getDummyComponent();
	var aLink = new CUORE.Renderers.Link();
	aLink.setContainer(container.id);
	aLink.addClass(aDOMClass);
	aLink.render(aComponent);
	
        var DOMElement = document.getElementById(container.id);
	var anchor = DOMElement.getElementsByTagName('a')[0];
        
        expect(anchor.getAttribute("href")).toEqual("anyURL");
    });

    it("support disabled", function () {
        var container = createTestContainer();

        var aDOMClass  = "aCssClass";
	var aComponent = getDummyComponent();
	var aLink = new CUORE.Renderers.Link();
	aLink.setContainer(container.id);
	aLink.addClass(aDOMClass);
	aLink.render(aComponent);
	
	aComponent.isEnabled = jasmine.createSpy().andReturn(false);
	aLink.update(aComponent);
	
        var DOMElement = document.getElementById(container.id);
	var anchor = DOMElement.getElementsByTagName('a')[0];
        
        expect(anchor.getAttribute("href")).toEqual("");
	expect(CUORE.Dom.hasClass(DOMElement, "disabled")).toBeTruthy();
    });


    it("has CSS class 'link'", function () {
	var container = createTestContainer();

	var aComponent = getDummyComponent();
	var aLink = new CUORE.Renderers.Link();
	aLink.setContainer(container.id);
	aLink.render(aComponent);
	
        var DOMElement = document.getElementById(container.id);
        expect(CUORE.Dom.hasClass(DOMElement, "link")).toBeTruthy();
    });

    var createTestContainer = function() {
        var container = document.createElement('div');
        container.id = "testingContainer";
        var panel = document.getElementById("xhtmlToTest");
        panel.appendChild(container);

        return container;
    };
    
    var getDummyComponent = function(){
	var aComponent = {};

	aComponent.isEnabled = jasmine.createSpy().andReturn(true);
	aComponent.getText = jasmine.createSpy().andReturn('anyText');
	aComponent.doYouReplace = jasmine.createSpy().andReturn(true);
	aComponent.doYouHijack = jasmine.createSpy().andReturn(true);
	aComponent.getContainer = jasmine.createSpy().andReturn("testingContainer");
	aComponent.getURL = jasmine.createSpy().andReturn('anyURL');
	
	return aComponent;
    };
});