describe("Input", function() {

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

        this.addMatchers({
            toBeInstanceOf: CUORE.Matchers.toBeInstanceOf
        });
    });

    afterEach(function() {
        var container = document.getElementById('xhtmlToTest');
        container.innerHTML = '';

        xhr.restore();
    });

    it("inherits Component", function() {
        var theComponent = getComponentInput();
        expect(theComponent).toBeInstanceOf(CUORE.Components.Input);
        expect(theComponent).toBeInstanceOf(CUORE.Component);
    });

   

    it("allows to get its value", function() {
        var aComponent = getComponentInput();
        aComponent.draw();

        var DOMObject = document.getElementById(aComponent.getUniqueID());
        DOMObject.getElementsByTagName("input")[0].value = "testText";

        expect(aComponent.getValue()).toEqual("testText");
    });

    it("allows to set a value", function() {
        var aComponent = getComponentInput();
        aComponent.draw();

        aComponent.setValue("testText");

        DOMObject = document.getElementById(aComponent.getUniqueID());
        var value = DOMObject.getElementsByTagName("input")[0].value;
        expect(value).toEqual("testText");
    });

    it("allows to set an empty value", function() {
        var aComponent = getComponentInput();
        aComponent.draw();

        aComponent.setValue("testText");
        aComponent.renderer.DOMInput.value = "";

        expect(aComponent.getValue()).toEqual("");
    });

    it("allows no be enabled or disable", function() {
        var aComponent = getComponentInput();
        aComponent.draw();
        DOMInput = document.getElementById(aComponent.getUniqueID()).getElementsByTagName("input");

        expect(DOMInput.disabled).toBeFalsy();

        aComponent.disable();
        expect(DOMInput.disabled).toBeUndefined();

        aComponent.enable();
        expect(DOMInput.disabled).toBeFalsy();
    });

    describe('has a name field', function(){
        it("allows to set the name to be submitted in the form", function() {
           var aComponent = getComponentInput();

           aComponent.setFormName('aName');

           expect(aComponent.getFormName()).toEqual('aName');
       });
    });

         

    it("allows changing the type", function() {
        var aComponent = getComponentInput();
        aComponent.draw();

        DOMInput = document.getElementById(aComponent.getUniqueID()).getElementsByTagName("input")[0];
        expect(DOMInput.type).toEqual("text");

        var container = document.getElementById('xhtmlToTest');
        container.innerHTML = '';
        aComponent = new CUORE.Components.Input(undefined, "password");
        aComponent.setContainer("xhtmlToTest");
        aComponent.draw();
        DOMInput = document.getElementById(aComponent.getUniqueID()).getElementsByTagName("input")[0];
        expect(DOMInput.type).toEqual("password");
    });

    it("allows set the text without drawing previously", function() {
        var aComponent = getComponentInput();
        aComponent.setText('CanonicalKey', 'testText');
        aComponent.draw();
        DOMObject = document.getElementById(aComponent.getUniqueID());
        var value = DOMObject.getElementsByTagName("label")[0].innerHTML;
        expect(value).toEqual("testText");
    });

    it("must clean its text when drawn by parent", function() {
        var aComponent = getComponentInput();
        aComponent.setText('CanonicalKey', 'testText');
        aComponent.draw();
        DOMObject = document.getElementById(aComponent.getUniqueID());
        var value = DOMObject.innerHTML;
        expect(value).toMatch("testText");
    });

    it("must update its text when drawn", function() {
        var aComponent = getComponentInput();
        aComponent.draw();
        aComponent.setText('CanonicalKey', "testText");
        DOMObject = document.getElementById(aComponent.getUniqueID());
        var value = DOMObject.innerHTML;
        expect(value).toMatch("testText");
    });

    it("uses the container as panel when component has hijack behaviour", function() {
        var aComponent = getComponentInput();
        aComponent.behave(CUORE.Behaviours.HIJACK);
        aComponent.draw();
        DOMObject = document.getElementById('xhtmlToTest');

        expect(DOMObject.childNodes[0].tagName).toEqual('LABEL');
    });

    it("when disabling has disable class", function() {
        var aComponent = getComponentInput();

        var componentId = aComponent.getUniqueID();

        aComponent.disable();
        aComponent.draw();

        var element = document.getElementById(componentId);

        expect(CUORE.Dom.hasClass(element, "disabled")).toBeTruthy();

        aComponent.enable();

        expect(CUORE.Dom.hasClass(element, "disabled")).toBeFalsy();
    });

    var getComponentInput = function() {
        var aComponent = new CUORE.Components.Input("CanonicalKey");
        aComponent.setContainer("xhtmlToTest");
        return aComponent;
    };
});
