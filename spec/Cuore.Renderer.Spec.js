describe("Renderer", function () {
    it("initialization sets container to document.body", function () {
        var aRenderer = new CUORE.Renderer();
        expect(aRenderer.getContainer()).toEqual(document.body);
    });
});