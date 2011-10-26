describe("A component", function() {
    var aComponent;
    beforeEach(function() {
        aComponent = new CUORE.Component();
    });
    
    it("has a replace behaviour by default", function() {
        expect(aComponent.doYouReplace()).toBeTruthy();
    });

    it("can cancel its replace behaviour", function() {
        aComponent.dontReplace();
      
        expect(aComponent.doYouReplace()).toBeFalsy();
    });

    describe("given a service directory is set", function() {
        var aDirectory;
        beforeEach(function() {
            aDirectory = CUORE.Mocks.Directory();
            aComponent.setDirectory(aDirectory);
        });

        it("should ignore undefined keys when getLabel called", function () {
            aComponent.requestLabelText(null);
            aComponent.requestLabelText(undefined);

            expect(aDirectory.execute).not.toHaveBeenCalled();
        });

        it("can execute a service through the directory", function() {
            var theServiceName = "serviceName";
            var theProcedureName = "procedureName";
            var params = "these are the mock params";

            aComponent.execute(theServiceName, theProcedureName, params, true);

            expect(aDirectory.execute).toHaveBeenCalledWith(theServiceName, theProcedureName, params, true);
        });

        describe("when i18n label is changed", function() {
            it("label service is used to fetch the label text", function() {
                var labelKey="label.key";

                aComponent.setI18NKey(labelKey);

                expect(aDirectory.execute).toHaveBeenCalledWith("LABELS", 'getLabel', {key:labelKey}, true);
            });

            it("and the key is empty, label service won't be used to fetch the label text", function() {
                aComponent.setI18NKey(null);

                expect(aDirectory.execute).not.toHaveBeenCalled();
            });

            it("the component's text is set to the label key while the label service has not yet replied", function() {
                var labelKey="label.key";

                aComponent.setI18NKey(labelKey);

                expect(aComponent.getText()).toContain(labelKey);
            });

            it("a handler exists to receive the label value", function() {
                var labelKey="label.key";

                aComponent.setI18NKey(labelKey);

                expect(aComponent.getManagedEvents()).toContain('LABELS_getLabel_EXECUTED_'+labelKey);
            });

            it("when dispatch is called, the handler registered to receive the label value changes the component's text", function() {
                var labelKey="label.key";
                var labelText='label text';
                var message= CUORE.Mocks.mock("label message", ['getFromAnswer']);
                message.getFromAnswer.andReturn(labelText);
                aComponent.setI18NKey(labelKey);

                aComponent.eventDispatch('LABELS_getLabel_EXECUTED_'+labelKey, message);

                expect(message.getFromAnswer).toHaveBeenCalledWith('text');
                expect(aComponent.getText()).toEqual(labelText);
            });
        });
    });

    describe("given the directory has not yet been set", function() {
        it("can execute a service through the directory", function() {
            var theServiceName = "serviceName";
            var theProcedureName = "procedureName";
            var params = "these are the mock params";

            expect(function() {
                      aComponent.execute(theServiceName, theProcedureName, params, true);
                  }).toThrow("Cannot call service. A service directory is not configured");
        });

        describe("when i18n label is changed", function() {
            it("and the key is empty it won't change the text", function() {
                var labelKey="label.key";
                aComponent.setI18NKey(labelKey);

                aComponent.setI18NKey(null);

                expect(aComponent.getText()).toContain(labelKey);
            });

            it("the component's text is set to the label key", function() {
                var labelKey="label.key";

                aComponent.setI18NKey(labelKey);

                expect(aComponent.getText()).toContain(labelKey);
            });

            it("a handler exists to receive the label value", function() {
                var labelKey="label.key";

                aComponent.setI18NKey(labelKey);

                expect(aComponent.getManagedEvents()).toContain('LABELS_getLabel_EXECUTED_'+labelKey);
            });

            it("when dispatch is called, the handler registered to receive the label value changes the component's text", function() {
                var labelKey="label.key";
                var labelText='label text';
                var message= CUORE.Mocks.mock("label message", ['getFromAnswer']);
                message.getFromAnswer.andReturn(labelText);
                aComponent.setI18NKey(labelKey);

                aComponent.eventDispatch('LABELS_getLabel_EXECUTED_'+labelKey, message);

                expect(message.getFromAnswer).toHaveBeenCalledWith('text');
                expect(aComponent.getText()).toEqual(labelText);
            });

            it("a label service is used to fetch the label text but only when the directory is configured", function() {
                var labelKey="label.key";
                var aDirectory=CUORE.Mocks.Directory();

                aComponent.setI18NKey(labelKey);
                aComponent.setDirectory(aDirectory);

                expect(aDirectory.execute).toHaveBeenCalledWith("LABELS", 'getLabel', {key:labelKey}, true);
            });
        });
    });
});