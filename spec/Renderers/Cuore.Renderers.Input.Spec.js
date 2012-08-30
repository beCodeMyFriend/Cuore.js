describe("Input Renderer", function() {

    var xhr;

    beforeEach(function() {
        xhr = sinon.useFakeXMLHttpRequest();
        var requests = [];

        xhr.onCreate = function(xhr) {
            requests.push(xhr);
        };

        CUORE.Core.createXHR = function() {
            return xhr;
        };
    });

    afterEach(function() {
        var container = document.getElementById('xhtmlToTest');
        container.innerHTML = '';

        xhr.restore();
    });

    it("is drawn in a container", function() {
        var aService = {};
        aService.execute = function(procedure, params, asynchronous) {};

        var theComponent = getComponentInput();
        theComponent.getLabelService = function() {
            return aService;
        };

        theComponent.draw();

        var DOMObject = document.getElementById(theComponent.getUniqueID());

        expect(CUORE.Dom.hasClass(DOMObject, "inputJS")).toBeTruthy();

        var children = DOMObject.getElementsByTagName("input");
        expect(children.length).toEqual(1);
        children = DOMObject.getElementsByTagName("label");
        expect(children.length).toEqual(1);
    });

    describe('has a name field', function(){
        it("renders the name attribute when provided", function() {
           var aComponent = getComponentInput();
           aComponent.draw();
           var DOMInput = document.getElementById(aComponent.getUniqueID()).getElementsByTagName("input")[0];

           expect(DOMInput.name).toEqual('');

           aComponent.setFormName('aName');
           aComponent.draw();

           expect(DOMInput.name).toEqual('aName');
       });
    });

    var getComponentInput = function() {
        var aComponent = new CUORE.Components.Input("CanonicalKey");
        aComponent.setContainer("xhtmlToTest");
        return aComponent;
    };
});