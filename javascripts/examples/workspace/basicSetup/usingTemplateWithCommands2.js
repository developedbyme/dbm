dbm.runTempFunction(function() {
	//"use strict";
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var WindowSizeNode = dbm.importClass("com.developedbyme.flow.nodes.browser.WindowSizeNode");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var visualTemplatesPath = "../assets/examples/workspace/basicSetup/visualTemplatesWithCommands2.html#mainWorkspace";
		
		var fileLoaded = function() {
			console.log("fileLoaded");
			
			var windowSizeNode = WindowSizeNode.create(dbm.getWindow());
			windowSizeNode.start();
			
			dbm.singletons.dbmTemplateManager.createControllersForAsset(visualTemplatesPath, {"width": windowSizeNode.getProperty("width"), "height": windowSizeNode.getProperty("height")}, true, dbm.getDocument().body, true);
		};
		
		var templateLoader = dbm.singletons.dbmAssetRepository.getAsset(visualTemplatesPath);
		templateLoader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, fileLoaded, []));
		templateLoader.load();
	});
});