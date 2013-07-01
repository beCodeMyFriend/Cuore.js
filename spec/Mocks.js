CUORE.Mocks = {

	handler: function(mockName) {
		var methods = ['setOwner', 'handle'];
		return jasmine.createSpyObj(mockName, methods);
	},

	bus: function(mockName) {
		var methods = ['emit'];
		return jasmine.createSpyObj(mockName, methods);
	},

	service: function(mockName) {
		var methods=['getName', 'execute'];
    return jasmine.createSpyObj(mockName, methods);
  },

	remoteService: function(mockName) {
		var methods=['getName', 'setBaseURL', 'execute'];
    return jasmine.createSpyObj(mockName, methods);
  },

  namedService:function(serviceName){
  	var aService = this.remoteService('aService');
    aService.getName.andReturn(serviceName);
    return aService;
  },

	component: function(mockName) {
		var methods = [
			'setContainer',
			'dontReplace',
			'setName',
			'getManagedEvents',
			'draw',
			'setDirectory',
			'execute',
			'behave',
			'onEnvironmentUp',
			'getName'];
		return jasmine.createSpyObj(mockName, methods);
	}
};