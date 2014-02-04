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
		
		var fileLoaded = function(aLoader) {
			console.log("fileLoaded");
			
			var windowSizeNode = WindowSizeNode.create(dbm.getWindow());
			windowSizeNode.start();
			
			var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(visualTemplatesPath, null, true, dbm.getDocument().body, true);
			
			var mainWorkspace = templateResult.mainController;
			mainWorkspace.setPropertyInput("width", windowSizeNode.getProperty("width"));
			mainWorkspace.setPropertyInput("height", windowSizeNode.getProperty("height"));
		};
		
		var templateLoader = dbm.singletons.dbmAssetRepository.getAsset(visualTemplatesPath);
		templateLoader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, fileLoaded, []));
		templateLoader.load();
	});
});