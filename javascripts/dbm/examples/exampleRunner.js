dbm.runTempFunction(function() {
	
	dbm.addStartFunction(function() {
		console.log("exampleRunner");
		
		var scriptPath = dbm.singletons["dbmPageManager"].getQueryStringParameter("script");
		console.log(scriptPath);
		
		dbm.loadFile(scriptPath);
		dbm.restartLoading();
	});
});