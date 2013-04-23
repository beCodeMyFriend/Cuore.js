describe("State", function() {
    var aState, key, value;

    describe("When instantiated ", function() {

        beforeEach(function() {
            aState = new CUORE.State();
            key = 'arbitrary';
            this.addMatchers(CUORE.Matchers);
        });

        it("is a State", function() {
            expect(aState).toBeInstanceOf(CUORE.State);
        });

        it("knows keys stored", function() {
            aState.save(key, 'any_value');
            expect(aState.hasKey(key)).toBeTruthy();
            expect(aState.hasKey('non existent')).toBeFalsy();
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

        });

        it("can store null values", function() {
            aState.save(key, null);
            expect(aState.hasKey(key)).toBeTruthy();
            expect(aState.retrieve(key)).toBeNull();
        });
        
        it("ignores key whith undefined value", function() {
            aState.save(key, undefined);
            expect(aState.hasKey(key)).toBeFalsy();
        });
    });


});