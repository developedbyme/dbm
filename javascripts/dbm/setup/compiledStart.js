dbm.runTempFunction(function() {
	window.onload = function() {
		window.onload = null;
		dbm.externalStart();
	};
});