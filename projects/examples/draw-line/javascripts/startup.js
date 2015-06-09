dbm.runTempFunction(function() {
	
	var Application = dbm.importClass("Application");
	
	dbm.addStartFunction(function() {
		//console.log("startup");
		var runningInstance = (new Application()).init();
		runningInstance.start();
	});
});