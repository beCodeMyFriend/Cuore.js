describe("Message", function() {

    var aMessage;

    beforeEach(function() {
        aMessage = new CUORE.Message();
        this.addMatchers({
            toBeInstanceOf: CUORE.Matchers.toBeInstanceOf
        });
    });

    it("is an instance of Message", function() {
        expect(aMessage).toBeInstanceOf(CUORE.Message);
    });

    it("serializes to JSON with right structure", function() {
        var aJson = aMessage.asJson();
        expect(aJson).toEqual('{"header":{},"query":{},"answer":{}}');
    });

    it("manages duplas in header", function() {
        aMessage.putOnHeader("aKey", "aValue");
        aMessage.putOnHeader("anotherKey", "anotherValue");

        aMessage.removeFromHeader("anotherKey");
        var retrieved = aMessage.getFromHeader("aKey");

        expect(retrieved).toEqual('aValue');
        expect(aMessage.asJson()).toEqual('{"header":{"aKey":"aValue"},"query":{},"answer":{}}');
    });

    it("manages duplas in query", function() {
        aMessage.putOnQuery("aKey", "aValue");
        aMessage.putOnQuery("anotherKey", "anotherValue");

        aMessage.removeFromQuery("anotherKey");
        var retrieved = aMessage.getFromQuery("aKey");

        expect(retrieved).toEqual('aValue');
        expect(aMessage.asJson()).toEqual('{"header":{},"query":{"aKey":"aValue"},"answer":{}}');
    });

    it("manages maps in query", function() {
        aMessage.putMapOnQuery({
            "alfaKey": "alfaValue",
            "betaKey": "betaValue"
        });

        expect(aMessage.getFromQuery("alfaKey")).toEqual('alfaValue');
        expect(aMessage.getFromQuery("betaKey")).toEqual('betaValue');

        expect(aMessage.asJson()).toEqual('{"header":{},"query":{"alfaKey":"alfaValue","betaKey":"betaValue"},"answer":{}}');
    });

    it("manages maps in answer", function() {
        aMessage.putMapOnAnswer({
            "alfaKey": "alfaValue",
            "betaKey": "betaValue"
        });

        expect(aMessage.getFromAnswer("alfaKey")).toEqual('alfaValue');
        expect(aMessage.getFromAnswer("betaKey")).toEqual('betaValue');

        expect(aMessage.asJson()).toEqual('{"header":{},"query":{},"answer":{"alfaKey":"alfaValue","betaKey":"betaValue"}}');
    });

    it("manages duplas in answer", function() {
        aMessage.putOnAnswer("aKey", "aValue");
        aMessage.putOnAnswer("anotherKey", "anotherValue");

        aMessage.removeFromAnswer("anotherKey");
        var retrieved = aMessage.getFromAnswer("aKey");

        expect(retrieved).toEqual('aValue');
        expect(aMessage.asJson()).toEqual('{"header":{},"query":{},"answer":{"aKey":"aValue"}}');
    });

    it("allows values with empty string", function() {
        aMessage.putOnAnswer("aKey", "");

        expect(aMessage.asJson()).toEqual('{"header":{},"query":{},"answer":{"aKey":""}}');

        aMessage.putOnAnswer("aKey", undefined);

        expect(aMessage.asJson()).toEqual('{"header":{},"query":{},"answer":{}}');
    });

    it("builds a message from a JSON", function() {
        var jsonMessage = '{"header":{"aHeaderKey":"aHeaderValue"},"query":{"aQueryKey":"aQueryValue"},"answer":{"anAnswerKey":"anAnswerValue"}}';

        aMessage = new CUORE.Message(jsonMessage);

        expect(aMessage.getFromHeader("aHeaderKey")).toEqual("aHeaderValue");
        expect(aMessage.getFromQuery("aQueryKey")).toEqual("aQueryValue");
        expect(aMessage.getFromAnswer("anAnswerKey")).toEqual("anAnswerValue");
    });

    it("builds a message from an object", function() {
        var objectMessage = {header:{aHeaderKey:"aHeaderValue"},query:{aQueryKey:"aQueryValue"},answer:{anAnswerKey:"anAnswerValue"}};

        aMessage = new CUORE.Message(objectMessage);

        expect(aMessage.getFromHeader("aHeaderKey")).toEqual("aHeaderValue");
        expect(aMessage.getFromQuery("aQueryKey")).toEqual("aQueryValue");
        expect(aMessage.getFromAnswer("anAnswerKey")).toEqual("anAnswerValue");
    });

    it("builds a message from a empty JSON", function() {
        aMessage = new CUORE.Message(null);
        expect(aMessage).toBeInstanceOf(CUORE.Message);
        aMessage = new CUORE.Message(undefined);
        expect(aMessage).toBeInstanceOf(CUORE.Message);
        aMessage = new CUORE.Message("");
        expect(aMessage).toBeInstanceOf(CUORE.Message);
        aMessage = new CUORE.Message({});
        expect(aMessage).toBeInstanceOf(CUORE.Message);
        aMessage = new CUORE.Message({
            "content": "moreContent"
        });
        expect(aMessage).toBeInstanceOf(CUORE.Message);
    });

    it("does not allows bad values", function() {
        var jsonMessage = '{"header":{"aHeaderKey":"null","anotherHeaderKey":null},"query":{"aQueryKey":null},"answer":{"anAnswerKey":"undefined","anotherAnswerKey":null}}';
        var goodMessage = '{"header":{"aHeaderKey":"null"},"query":{},"answer":{"anAnswerKey":"undefined"}}';

        aMessage = new CUORE.Message(jsonMessage);

        expect(aMessage.asJson()).toEqual(goodMessage);
    });

    it("does not allows bad values", function() {
        var goodMessage = '{"header":{},"query":{},"answer":{}}';

        aMessage.putOnAnswer("anotherKey", null);
        aMessage.putOnQuery("anyKey", null);
        aMessage.putOnHeader("aKey", null);

        expect(aMessage.getFromHeader("aKey")).toEqual("");
        expect(aMessage.getFromQuery("anyKey")).toEqual("");
        expect(aMessage.getFromAnswer("anotherKey")).toEqual("");

        expect(aMessage.getFromAnswer("randomKey")).toEqual("");
        expect(aMessage.asJson()).toEqual(goodMessage);
    });
});