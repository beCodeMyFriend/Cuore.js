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
                toContainAnElement: CUORE.Matchers.toContainAnElement,
                toContainClass: CUORE.Matchers.toContainClass
            });

            createContainer();

            aRenderer = new CUORE.Renderer();
            aRenderer.setContainer(container.id);

            aComponent = dummyComponent();
        });

        afterEach(function() {
            panel.removeChild(container);
        });

        it("renders a div tag  by default", function() {
            aComponent.doYouReplace = jasmine.createSpy().andReturn(false);
            aComponent.doYouHijack = jasmine.createSpy().andReturn(false);

            aRenderer.render(aComponent);
            expect(container).toContainAnElement('div');
        });

        it("can be erased", function() {
            aComponent.doYouReplace = jasmine.createSpy().andReturn(false);
            aComponent.doYouHijack = jasmine.createSpy().andReturn(false);

            aRenderer.render(aComponent);
            expect(container).toContainAnElement('div');
            aRenderer.erase();
            expect(container).not.toContainAnElement('div');
        });

        it("can add CSS classes before and after render", function() {
            aRenderer.addClass('aClass');
            aRenderer.render(aComponent);
            aRenderer.addClass('anotherClass');

            expect(container).toContainClass('aClass');
            expect(container).toContainClass('anotherClass');
        });

        it("can remove CSS classes before and after render", function() {
            aRenderer.addClass('aClass');
            aRenderer.addClass('anotherClass');
            aRenderer.removeClass('aClass');
            aRenderer.render(aComponent);
            aRenderer.removeClass('anotherClass');

            expect(container).not.toContainClass('aClass');
            expect(container).not.toContainClass('anotherClass');
        });

        it("reflects disabled state with a proper CSS class", function() {
            aComponent.isEnabled.andReturn(false);
            aRenderer.render(aComponent);
            expect(container).toContainClass('disabled');
            aComponent.isEnabled.andReturn(true);
            aRenderer.render(aComponent);
            expect(container).not.toContainClass('disabled');
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
            expect(container).not.toContainAnElement('div');
            expect(container).toContainAnElement('span');
        });

        it("sets the tagname for rendering at initialization", function() {
            spyOn(aRenderer, 'setTagName');

            aRenderer.init();

            expect(aRenderer.setTagName).toHaveBeenCalled();
        });

        it("calls its decorators after paint", function() {
            var decorator = new CUORE.Decoration();
            spyOn(decorator, 'postPaint');
            var anotherDecorator = new CUORE.Decoration();
            spyOn(anotherDecorator, 'postPaint');

            aRenderer.addDecoration(decorator);
            aRenderer.addDecoration(anotherDecorator);
            aRenderer.render(aComponent);

            expect(decorator.postPaint).toHaveBeenCalledWith(aRenderer.panel);
            expect(anotherDecorator.postPaint).toHaveBeenCalledWith(aRenderer.panel);
        });

        it("calls its decorators after update", function() {
            var decorator = new CUORE.Decoration();
            spyOn(decorator, 'postUpdate');
            var anotherDecorator = new CUORE.Decoration();
            spyOn(anotherDecorator, 'postUpdate');

            aRenderer.addDecoration(decorator);
            aRenderer.addDecoration(anotherDecorator);
            aRenderer.render(aComponent);

            expect(decorator.postUpdate).toHaveBeenCalledWith(aRenderer.panel);
            expect(anotherDecorator.postUpdate).toHaveBeenCalledWith(aRenderer.panel);
        });

        describe('html ID must be correct', function(){

            it("default html element id is the component name", function() {
                aComponent.doYouHijack = jasmine.createSpy().andReturn(false);

                aRenderer.render(aComponent);

                expect(document.getElementById('anyName')).not.toBeNull();
            });

            it("ID must start with [a-zA-Z]", function() {
                aComponent.doYouHijack = jasmine.createSpy().andReturn(false);
                aComponent.getName = jasmine.createSpy().andReturn('1anyName');

                aRenderer.render(aComponent);

                expect(document.getElementById('1anyName')).toBeNull();
                expect(document.getElementById('a1anyName')).not.toBeNull();
            });

            it("ID  admits number of letters, digits ([0-9]), hyphens ('-'), underscores ('_'), colons (':'), and periods ('.') ", function() {
                aComponent.doYouHijack = jasmine.createSpy().andReturn(false);
                aComponent.getName = jasmine.createSpy().andReturn('any-N_a.m:e4');

                aRenderer.render(aComponent);

                expect(document.getElementById('any-N_a.m:e4')).not.toBeNull();

                aRenderer = new CUORE.Renderer();
                aRenderer.setContainer(container.id);
                aComponent.doYouHijack = jasmine.createSpy().andReturn(false);
                aComponent.getName = jasmine.createSpy().andReturn('any[Name');

                aRenderer.render(aComponent);

                expect(document.getElementById('any[Name')).toBeNull();
                expect(document.getElementById('anyName')).not.toBeNull();
            });

            it("ID must be the container one when hijacked", function() {
                aComponent.doYouHijack = jasmine.createSpy().andReturn(true);
                aComponent.getName = jasmine.createSpy().andReturn('anyName');

                aRenderer.render(aComponent);

                expect(document.getElementById('anyName')).toBeNull();
                expect(aRenderer.innerDivName('anyName')).toEqual('testingContainer');
            });
        });
    });
});