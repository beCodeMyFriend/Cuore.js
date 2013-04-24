CUORE.Mocks = {

	handler: function(mockName) {
		var methods = ['setOwner', 'handle'];
		return jasmine.createSpyObj(mockName, methods);
	},

	bus: function(mockName) {
		var methods = ['emit'];
		return jasmine.createSpyObj(mockName, methods);
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