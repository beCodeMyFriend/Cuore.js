describe("Cache", function() {
    var aCache;

    beforeEach(function() {
        aCache = new CUORE.Cache();
    });


    it("can store messages", function() {
        var key = "aKey";
        var aMessage = {};
        aMessage.query = key;
        aCache.store(aMessage);
        var retrievedMessage = aCache.retrieve(key);
        expect(retrievedMessage.query).toEqual(key);
    });

});