dbm.runTempFunction(function() {
	//"use strict";
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var SplitLayoutAreaPart = dbm.importClass("com.developedbyme.workspace.gui.parts.areas.layout.SplitLayoutAreaPart");
	var SizedElementAreaPart = dbm.importClass("com.developedbyme.workspace.gui.parts.areas.SizedElementAreaPart");
	
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
			
			var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(visualTemplatesPath, true, dbm.getDocument().body, true);
			
			var mainWorkspace = templateResult.mainController;
			mainWorkspace.setPropertyInput("width", windowSizeNode.getProperty("width"));
			mainWorkspace.setPropertyInput("height", windowSizeNode.getProperty("height"));
			
			//Layouts
			var mainSplitLayout = SplitLayoutAreaPart.create();
			mainSplitLayout.setupHorizontalSplit();
			mainSplitLayout.setPropertyInput("splitOffset", 30);
			
			mainWorkspace.addPart("main/splitLayout", mainSplitLayout);
			
			var splitLayout2 = SplitLayoutAreaPart.create();
			splitLayout2.setupVerticalSplit();
			splitLayout2.setPropertyInput("splitPosition", 0.8);
		
			mainWorkspace.addPart("main/splitLayout/area2/splitLayout", splitLayout2);
		};
		
		var templateLoader = dbm.singletons.dbmAssetRepository.getAsset(visualTemplatesPath);
		templateLoader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, fileLoaded, []));
		templateLoader.load();
	});
});