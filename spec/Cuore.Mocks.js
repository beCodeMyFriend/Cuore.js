CUORE.Mocks = {
    mock: function(name, methodNames) {
      var r = {'_description':name}
          , numberOfMethods = methodNames.length
          , methodName;
      for(var i = 0; i < numberOfMethods; i++) {
        methodName = methodNames[i];
        r[methodName] = jasmine.createSpy(name + "." + methodName);
      }
      return r;
    },

    Registry: function() {
        return CUORE.Mocks.mock('registry', ['register', 'size', 'each']);
    },

    Directory: function() {
        return CUORE.Mocks.mock('directory', ['add', 'list', 'execute', 'getService', 'setBaseURL']);
    },

    Service: function() {
        return CUORE.Mocks.mock('service', ['getName', 'setBaseURL', 'execute']);
    },

    Component: function(name) {
        var component = CUORE.Mocks.mock('component '+name, [
            'setContainer',
            'dontReplace',
            'setName',
            'getManagedEvents',
            'draw',
            'setDirectory',
            'execute'
        ]);
        component.getManagedEvents.andReturn([]);
        component.getName=function() {
          return component.setName.mostRecentCall.args[0]
        };
        return component;
    }
};