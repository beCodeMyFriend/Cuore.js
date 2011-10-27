describe("Handler", function () {

    it("page is document.page", function () {
        var aHandler = new CUORE.Handler();
        document.page = new CUORE.Application();
        document.page.tag = "Tag";
        var result = aHandler.getPage();

        expect(aHandler.getPage().tag).toEqual("Tag");
    });

    it("has an owner", function () {
        var aHandler = new CUORE.Handler();
        var anObject = {};

        aHandler.setOwner(anObject);

        expect(aHandler.getOwner()).toEqual(anObject);
    });

});