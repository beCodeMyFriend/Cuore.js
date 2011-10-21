describe("Collapsable Panel", function () {

    afterEach(function(){
        var container = document.getElementById('xhtmlToTest');   
        container.innerHTML = '';
    });

    it("inherits Component", function () {

        var aPanel = new CUORE.Components.Collapsable();

        expect(aPanel instanceof CUORE.Components.Collapsable).toBeTruthy();
        expect(aPanel instanceof CUORE.Component).toBeTruthy();
    });

    it("can be draw in a container", function () {
        var container = createTestContainer();

        var aPanel = new CUORE.Components.Collapsable();
        aPanel.setContainer(container.id);

        aPanel.draw();

        var DOMPanel = document.getElementById(aPanel.getUniqueID());

        expect(DOMPanel).toBeTruthy();
        expect(DOMPanel.tagName).toEqual("DIV");

        expect(CUORE.Dom.hasClass(DOMPanel, "collapsablePanel")).toBeTruthy();
        expect(CUORE.Dom.hasClass(DOMPanel, "collapsed")).toBeTruthy();

    });

    it("change css class when collapse", function () {
        var container = createTestContainer();

        var aPanel = new CUORE.Components.Collapsable();
        aPanel.setContainer(container.id);

        expect(aPanel.isCollapsed()).toBeTruthy();
        aPanel.uncollapse();
        expect(aPanel.isCollapsed()).toBeFalsy();

        aPanel.draw();
        var DOMPanel = document.getElementById(aPanel.getUniqueID());

        expect(CUORE.Dom.hasClass(DOMPanel, "uncollapsed")).toBeTruthy();
        expect(CUORE.Dom.hasClass(DOMPanel, "collapsed")).toBeFalsy();

        aPanel.collapse();
        expect(aPanel.isCollapsed()).toBeTruthy();
        expect(CUORE.Dom.hasClass(DOMPanel, "collapsed")).toBeTruthy();
        expect(CUORE.Dom.hasClass(DOMPanel, "uncollapsed")).toBeFalsy();

    });

    it("has height 0 when collapsed but has some height when not", function () {
        var numberOfAssertionsInText = 2;
        expect(numberOfAssertionsInText);

        var container = createTestContainer();

        var aPanel = new CUORE.Components.Collapsable();
        aPanel.uncollapse();

        aPanel.setContainer(container.id);

        aPanel.setText("dummyText");
        aPanel.draw();

        aPanel.collapse();

        var DOMPanel = document.getElementById(aPanel.getUniqueID());

        expect(DOMPanel.style.height).toEqual("0px");

        aPanel.uncollapse();

        expect(DOMPanel.style.height).toNotEqual("0px");
    });

    var createTestContainer = function() {
        var container = document.createElement('div');
        container.id = "testingContainer";
        var panel = document.getElementById("xhtmlToTest");
        panel.appendChild(container);
       
        return container;
    };
});