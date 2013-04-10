describe("Label Panel", function() {

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

    it("inherits Component", function() {
        var thePanel = new CUORE.Components.LabelPanel();

        expect(thePanel instanceof CUORE.Component).toBeTruthy();
        expect(thePanel instanceof CUORE.Components.LabelPanel).toBeTruthy();
    });

    it("could be initialized with I18NKey", function() {
        var aI18NKey = "CanonicalKey";
        var thePanel = new CUORE.Components.LabelPanel(aI18NKey);
        expect(thePanel.getLabelText()).toEqual(aI18NKey);
    });

    describe('Renderer', function() {
        it('displays a text', function() {

            var aComponent = {};
            aComponent.getLabelText = jasmine.createSpy('getLabelText').andReturn('testLabel')
            aComponent.doYouReplace = jasmine.createSpy('doYouReplace').andReturn(false);
            aComponent.doYouHijack = jasmine.createSpy('doYouHijack').andReturn(false);
            aComponent.getName = jasmine.createSpy('getName').andReturn('aName');
            aComponent.isEnabled = jasmine.createSpy('isEnabled').andReturn(true);

            var aRenderer = new CUORE.Renderers.LabelPanel();
            aRenderer.setContainer(createTestContainer());

            aRenderer.render(aComponent);

            var DOMLabel = document.getElementById(aRenderer.htmlID);

            expect(DOMLabel.innerHTML).toEqual('testLabel');
        });

        var createTestContainer = function() {
                var container = document.createElement('div');
                container.id = "testingContainer";
                var panel = document.getElementById("xhtmlToTest");
                panel.appendChild(container);

                return container.id;
            };
    });

    it("adds the class labelPanel when drawn", function() {
        var thePanel = new CUORE.Components.LabelPanel("CanonicalKey");
        spyOn(thePanel, 'addClass');

        thePanel.init();

        expect(thePanel.addClass).toHaveBeenCalledWith('labelPanel');
    });

});
