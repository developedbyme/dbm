dbm.runTempFunction(function() {
	
	var Application = dbm.importClass("Application");
	
	dbm.addStartFunction(function() {
		//console.log("startup");
		
		dbm.singletons.dbmAssetRepository.createLink("dbm-assets", "../../../assets");
		
		var runningInstance = (new Application()).init();
		runningInstance.start();
	});
});