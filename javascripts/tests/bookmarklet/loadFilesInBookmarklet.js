dbm.runTempFunction(function() {
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var WindowManager = dbm.importClass("dbm.core.globalobjects.windowmanager.WindowManager");
	
	var IframeElement = dbm.importClass("dbm.gui.other.IframeElement");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var bookmarkletMainWindow = WindowManager.getInstance().getWindow("bookmarkletMain");
		
		dbm.singletons.dbmAssetRepository.linkFolderToServer("remotes/localhost", "http://localhost");
		dbm.singletons.dbmAssetRepository.linkFolderToServer("remotes/dbm", "http://www.developedbyme.com");
		
		var testAsset = dbm.singletons.dbmAssetRepository.getAsset("remotes/localhost/tests/dbm/xml/testData.xml");
		
		console.log(testAsset);
		
		var fileLoaded = function() {
			console.log("loaded");
		}
		
		testAsset.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, fileLoaded, []));
		testAsset.load();
	});
});