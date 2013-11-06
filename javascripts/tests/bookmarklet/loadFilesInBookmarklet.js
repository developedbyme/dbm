dbm.runTempFunction(function() {
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var WindowManager = dbm.importClass("com.developedbyme.core.globalobjects.windowmanager.WindowManager");
	
	var IframeElement = dbm.importClass("com.developedbyme.gui.other.IframeElement");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
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