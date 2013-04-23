CUORE.Mocks = {

	Handler: function(mockName) {
		var methods = ['setOwner', 'handle'];
		return jasmine.createSpyObj(mockName, methods);
	},

	Component: function(mockName) {
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