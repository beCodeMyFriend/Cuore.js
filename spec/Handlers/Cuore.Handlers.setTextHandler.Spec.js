describe("setTextHandler", function () {

    it("inherits  Handler", function () {
        var aSetTextHandler = new CUORE.Handlers.setText();
        expect(aSetTextHandler instanceof CUORE.Handler).toBeTruthy();
        expect(aSetTextHandler instanceof CUORE.Handlers.setText).toBeTruthy();
    });

    it("sets the text of the owner reading as json object when dispatched", function () {
        var aSetTextHandler = new CUORE.Handlers.setText();

        var testText = "testText";
        var aButton = {};
        var settedText = null;

        aButton.setText = function (text) {};
        spyOn(aButton,"setText");

        aSetTextHandler.setOwner(aButton);

        var theMessage = new CUORE.Message();
        theMessage.putOnAnswer("text",testText);
        
        var correctMessage = theMessage;
       
        var incorrectMessage = new CUORE.Message();

        aSetTextHandler.handle(correctMessage);
        expect(aButton.setText).toHaveBeenCalledWith(testText);

        aButton.setText.reset();
        aSetTextHandler.handle(incorrectMessage);

        expect(aButton.setText).not.toHaveBeenCalled();
    }); 
});