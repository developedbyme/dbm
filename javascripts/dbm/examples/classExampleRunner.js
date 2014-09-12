dbm.runTempFunction(function() {
	
	dbm.addStartFunction(function() {
		console.log("exampleRunner");
		
		var classPath = dbm.singletons["dbmPageManager"].getQueryStringParameter("class");
		console.log(classPath);
		
		dbm.importClass(classPath);
		
		dbm.addStartFunction(function() {
			var RunningClass = dbm.singletons.dbmClassManager.getClassIfExists(classPath);
			
			if(RunningClass !== null) {
				var runningInstance = (new RunningClass()).init();
				console.log(runningInstance);
				runningInstance.start();
			}
			else {
				//METODO: error message
			}
		});
		
		dbm.restartLoading();
	});
});