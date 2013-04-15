describe("Cuore.Dom library", function() {

    var anElement;
    beforeEach(function() {
        anElement = document.createElement('span');
        this.addMatchers(CUORE.Matchers);
    });

    it("add classes to an HTMLElement", function() {
        CUORE.Dom.addClass(anElement, 'aClass');

        expect(anElement.className).toMatch('aClass');
        expect(function() {
            CUORE.Dom.addClass('notAnHTMLElement', 'aClass');
        }).toThrow('Must be an HTMLElement');
    });

    it("remove a class to an element as well", function() {
        anElement.className = 'aClass';
        
        CUORE.Dom.removeClass(anElement, 'aClass');
        
        expect(anElement.className).not.toMatch('aClass');
        expect(function() {
            CUORE.Dom.removeClass('notAnHTMLElement', 'aClass');
        }).toThrow('Must be an HTMLElement');
    });

    it("can check for a class to exist", function() {
        anElement.className = 'aClass anotherClass anotheraClass';
        
        expect(CUORE.Dom.hasClass(anElement, 'aClass')).toBeTruthy();
        expect(function() {
            CUORE.Dom.hasClass('notAnHTMLElement', 'aClass');
        }).toThrow('Must be an HTMLElement');
    });

    describe("Creation", function() {
        var attributes = {
            className: 'tal',
            height: 20,
            randomAttr: 'aValue'
        };

        it("can create an element just with the tagname", function() {
            anElement = CUORE.Dom.createElement('span');
        
            expect(anElement).toBeInstanceOf(HTMLElement);
        });

        it("can create with attributes ", function() {
            anElement = CUORE.Dom.createElement('span', attributes);
        
            expect(anElement.className).toEqual('tal');
            expect(anElement.height).toEqual(20);
            expect(anElement.randomAttr).toEqual('aValue');
        });

        it("can append a creation to a parent ", function() {
            var parent = document.createElement('span');
        
            anElement = CUORE.Dom.createElement('span', attributes, parent);
        
            expect(parent).toContainAnElement('span');
        });

        it("checks the parent when create", function() {
            anElement = CUORE.Dom.createElement('span', attributes, 'notAnHTMLElement');
            
            expect(anElement.parentElement).toBeNull();
        });
    });
});