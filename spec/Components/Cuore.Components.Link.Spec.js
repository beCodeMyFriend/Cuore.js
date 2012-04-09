describe("Link", function () {
	
    it("inherits Component", function () {
        var aLink = new CUORE.Components.Link();

        expect(aLink instanceof CUORE.Components.Link).toBeTruthy();
        expect(aLink instanceof CUORE.Component).toBeTruthy();
    });

    it("sets I18NKey in construct", function () {
        var aI18NKey = "CanonicalKey";
        var aLink = new CUORE.Components.Link('aURL',aI18NKey);
        expect(aLink.getText(aI18NKey)).toEqual(aI18NKey);
    });
    
    it("put url as text when no key given", function () {
        var aURL = "anURL";
        var aLink = new CUORE.Components.Link(aURL);
        expect(aLink.getLabelText()).toEqual(aURL);
    });

    it("has a Link renderer", function () {
        var aURL = "anURL";
        var aLink = new CUORE.Components.Link(aURL);
        expect(aLink.renderer instanceof CUORE.Renderers.Link).toBeTruthy();
    });

    it("support URL for renderer", function () {
        var aURL = "anURL";
        var aLink = new CUORE.Components.Link(aURL);
        expect(aLink.getURL()).toEqual("anURL");
    });
});