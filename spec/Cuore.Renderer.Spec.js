describe("A Renderer", function() {

    it("initialization sets container to document.body", function() {
        var anyRenderer = new CUORE.Renderer();
        expect(anyRenderer.getContainer()).toEqual(document.body);
    });

    describe("when drawn in a container", function() {
        var container;
        var panel;
        var aRenderer;
        var aComponent;

        var dummyComponent = function() {
                var aComponent = {};
                aComponent.isEnabled = jasmine.createSpy().andReturn(true);
                aComponent.getName = jasmine.createSpy().andReturn('anyName');
                aComponent.getText = jasmine.createSpy().andReturn('anyText');
                aComponent.doYouReplace = jasmine.createSpy().andReturn(true);
                aComponent.doYouHijack = jasmine.createSpy().andReturn(true);
                return aComponent;
            };

        var createContainer = function() {
                panel = document.getElementById("xhtmlToTest");
                container = document.createElement('div');
                container.id = "testingContainer";
                container.appendChild(document.createElement('figure'));
                panel.appendChild(container);
            };

        beforeEach(function() {

            this.addMatchers({
                toContainAnElement: function(HTMLElementType) {
                    var figures = this.actual.getElementsByTagName(HTMLElementType);
                    return (figures.length > 0);
                },

                toContainClass: function(classname) {
                    return CUORE.Dom.hasClass(this.actual, classname);
                }

            });

            createContainer();

            aRenderer = new CUORE.Renderer();
            aRenderer.setContainer(container.id);

            aComponent = dummyComponent();
        });

        afterEach(function() {
            panel.removeChild(container);
        });

        it("replaces container innerHTML when component has replace behaviour", function() {
            aRenderer.render(aComponent);
            expect(container).not.toContainAnElement('figure');
        });

        it("doesnt replaces container innerHTML when component has append behaviour", function() {
            aComponent.doYouReplace.andReturn(false);
            aComponent.doYouHijack.andReturn(false);
            aRenderer.render(aComponent);
            expect(container).toContainAnElement('figure');
        });

        it("uses the container as panel when component has hijack behaviour", function() {
            aComponent.doYouHijack.andReturn(true);
            aRenderer.addClass('hijacked');
            aRenderer.render(aComponent);

            expect(container).not.toContainAnElement('figure');
            expect(container).not.toContainAnElement('div');
            expect(container).toContainClass('hijacked');
        });

        it("can render an arbitrary tag", function() {
            aComponent.doYouReplace = jasmine.createSpy().andReturn(false);
            aComponent.doYouHijack = jasmine.createSpy().andReturn(false);
            aRenderer.setTagName('span')

            aRenderer.render(aComponent);
            console.log(container);
            expect(container).not.toContainAnElement('div');
            expect(container).toContainAnElement('span');
        });

        it("sets the tagname for rendering at initialization", function() {
            spyOn(aRenderer, 'setTagName');

            aRenderer.init();

            expect(aRenderer.setTagName).toHaveBeenCalled();
        });



    });
});