describe("State", function() {
    var aState, key, value;

    describe("When instantiated ", function() {

        beforeEach(function() {
            aState = new CUORE.State();
            key = 'arbitrary';
        });

        it("is a State", function() {
            expect(aState instanceof CUORE.State).toBeTruthy();
        });

        it("stores a value under a key", function() {
            expect(aState.hasKey(key)).toBeFalsy();
            aState.save(key, 'any_value');
            expect(aState.hasKey(key)).toBeTruthy();
        });

        it("retrieves undefined when no value is stored", function() {
            expect(aState.retrieve(key)).toBeUndefined();
        });


        describe("and  a value is stored ", function() {

            beforeEach(function() {
                value = 'any_value';
                aState.save(key, value);
            });

            it("retrieves value with its key", function() {
                expect(aState.retrieve(key)).toEqual(value);
            });

            it("overwrites with new value", function() {
                var aNewValue = 'a_new_value';

                aState.save(key, aNewValue);
                expect(aState.retrieve(key)).toEqual(aNewValue);
            });

            it("removes key when value is null or undefined", function() {
                aState.save(key, undefined);
                expect(aState.hasKey(key)).toBeFalsy();
            });
        });
    });


});