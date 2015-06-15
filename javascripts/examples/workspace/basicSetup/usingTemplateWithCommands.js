dbm.runTempFunction(function() {
	//"use strict";
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var SplitLayoutAreaPart = dbm.importClass("dbm.workspace.gui.parts.areas.layout.SplitLayoutAreaPart");
	var SizedElementAreaPart = dbm.importClass("dbm.workspace.gui.parts.areas.SizedElementAreaPart");
	
	var WindowSizeNode = dbm.importClass("dbm.flow.nodes.browser.WindowSizeNode");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var visualTemplatesPath = "../assets/examples/workspace/basicSetup/visualTemplatesWithCommands.html#mainWorkspace";
		
		var fileLoaded = function(aLoader) {
			console.log("fileLoaded");
			
			var windowSizeNode = WindowSizeNode.create(dbm.getWindow());
			windowSizeNode.start();
			
			var templateResult = dbm.singletons.dbmTemplateManager.createControllersForAsset(visualTemplatesPath, null, true, dbm.getDocument().body, true);
			
			var mainWorkspace = templateResult.mainController;
			mainWorkspace.setPropertyInput("width", windowSizeNode.getProperty("width"));
			mainWorkspace.setPropertyInput("height", windowSizeNode.getProperty("height"));
			mainWorkspace.linkElementSizeToWorkspaceArea();
			
			//Layouts
			var mainSplitLayout = SplitLayoutAreaPart.create();
			mainSplitLayout.setupHorizontalSplit();
			mainSplitLayout.setPropertyInput("splitOffset", 30);
			
			mainWorkspace.addPart("main/splitLayout", mainSplitLayout);
			
			var splitLayout2 = SplitLayoutAreaPart.create();
			splitLayout2.setupVerticalSplit();
			splitLayout2.setPropertyInput("splitPosition", 0.8);
		
			mainWorkspace.addPart("main/splitLayout/area2/splitLayout", splitLayout2);
			
			//Set areas
			mainWorkspace.addPart("main/splitLayout/area1", SizedElementAreaPart.create(templateResult.getController("area1")));
			mainWorkspace.addPart("main/splitLayout/area2", SizedElementAreaPart.create(templateResult.getController("area2")));
			mainWorkspace.addPart("main/splitLayout/area2/splitLayout/area2", SizedElementAreaPart.create(templateResult.getController("area2/area3")));
		};
		
		var templateLoader = dbm.singletons.dbmAssetRepository.getAsset(visualTemplatesPath);
		templateLoader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, fileLoaded, []));
		templateLoader.load();
	});
});