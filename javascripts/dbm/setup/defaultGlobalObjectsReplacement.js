(function() {
	if(window.console === undefined) {
		var console = new Object();
		window.console = console;
		console.dir = function(){};
		console.log = function(){};
		console.debug = function(){};
		console.info = function(){};
		console.warn = function(){};
		console.error = function(){};
		console.trace = function(){};
	}
})();