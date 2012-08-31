describe("Link", function () {

    beforeEach(function(){
        this.addMatchers({
            toBeInstanceOf: CUORE.Matchers.toBeInstanceOf
        });
    });
	
    it("inherits Component", function () {
        var aLink = new CUORE.Components.Link();

        expect(aLink).toBeInstanceOf(CUORE.Components.Link);
        expect(aLink).toBeInstanceOf(CUORE.Component);
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
        expect(aLink.renderer).toBeInstanceOf(CUORE.Renderers.Link);
    });

    it("support URL for renderer", function () {
        var aURL = "anURL";
        var aLink = new CUORE.Components.Link(aURL);
        expect(aLink.getURL()).toEqual("anURL");
    });
});