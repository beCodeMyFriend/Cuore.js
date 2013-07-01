describe("Cache", function() {
    var aCache;

    beforeEach(function() {
        aCache = new CUORE.Cache();
    });


    it("can store messages", function() {
        var key = "aKey";
        var aMessage = {};
        aMessage.query = key;
        aCache.put(aMessage);
        var retrievedMessage = aCache.get(key);
        expect(retrievedMessage.query).toEqual(key);
    });

});