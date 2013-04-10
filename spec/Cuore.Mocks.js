CUORE.Mocks = {

    Handler: function(mockName) {
        var methods=['setOwner', 'handle'];
        return jasmine.createSpyObj(mockName,methods);
    }

};