describe("Core.Class", function() {

    var parentClass,childClass;

    beforeEach(function() {
        parentClass = CUORE.Class(null, {
            aProperty: 'aProperty',
            init: function(){},
            aMethod: function(){},
            anotherMethod: function(){var foo=0;}
        });

        childClass = CUORE.Class(parentClass, {
            init: jasmine.createSpy(),
            anotherMethod: function(){var bar=0;}
        });
    });

    it(" childClass inherits properties and methods", function() {
        var instance = new childClass();
        expect(instance.aProperty).toEqual('aProperty');
        expect(typeof instance.aMethod).toEqual('function'); 
    });

    it(" childClass inherits method implementation", function() {
        var parent= new parentClass();
        var instance = new childClass();
        expect(instance.aMethod).toBe(parent.aMethod);
    });

    it(" childClass can override method implementation", function() {
        var parent= new parentClass();
        var instance = new childClass();
        expect(instance.anotherMethod).not.toBe(parent.anotherMethod);
    });

    it(" parent class implementation is at property parent", function() {
        parent= new parentClass();
        expect(childClass.parent.anotherMethod).toBe(parent.anotherMethod);
    });

    it(" uses init at instanciation", function() {
        var instance = new childClass();
        expect(instance.init).toHaveBeenCalled();
    });

});