describe("Core", function () {

    var head, 
        scriptCore;

    beforeEach(function(){
        Array.prototype.indexOf = undefined;
        scriptCore = document.createElement('script');
        scriptCore.src = '../src/Cuore.Core.js';
        head = document.getElementsByTagName('head')[0];
        head.appendChild(scriptCore);
    });

    afterEach(function(){
        head.removeChild(scriptCore);
    });

    it("provides array.indexOf if not present", function () {
        waits(1);
        runs(function(){
            expect(Array.prototype.indexOf).toBeDefined();
        });
    });

    it("provides a polyfilled array.indexOf that works on arrays without gaps", function () {
        waits(1);
        runs(function(){
            expect([].indexOf('not-present-element')).toEqual(-1);
            expect(['element'].indexOf('element')).toEqual(0);
            expect(['element','another element','yet one more'].indexOf('another element')).toEqual(1);
        });
    }); 
    
    it("provides a polyfilled array.indexOf that works on arrays with gaps", function () {
        waits(1);
        runs(function(){
            var array = [];
            array[0] = 'element';
            array[2] = 'another element';

            expect(array.indexOf('another element')).toEqual(2);
        });
    });     
});
