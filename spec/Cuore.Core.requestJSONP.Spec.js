describe("Core request JsonP", function() {
    
    var URL = 'aUrl';

    it("form a script with the url at dom", function() {
        var callbackName = CUORE.Core.requestJSONP(URL,{'hola':'mundo',"adios":"mundocruel"},null);
        var scripts=document.getElementsByTagName("script");
        var lastScript=scripts[scripts.length -1];
        expect(lastScript.src).toMatch('aUrl'+callbackName+'&hola=mundo&adios=mundocruel&');
        expect(lastScript.id).toEqual(callbackName);
    });
    
    it("injects a function as callback ", function() {
        var tal = jasmine.createSpy('daCallback');
        var callbackName = CUORE.Core.requestJSONP(URL,{'hola':'mundo',"adios":"mundocruel"},tal);
        var response={"arbitrary":"arbitrary"};
        window[callbackName](response);
        
        expect(typeof window[callbackName] ).toEqual('function');
        expect(tal).toHaveBeenCalledWith(response);
    });
    
     it("removes the script at callback execution", function() {
        var callbackName = CUORE.Core.requestJSONP(URL,{'hola':'mundo',"adios":"mundocruel"},null);
        var scripts=document.getElementsByTagName("script");
        var lastScript=scripts[scripts.length -1];
        window[callbackName]({});
        expect(document.getElementById(callbackName)).toEqual(undefined);
    });
});