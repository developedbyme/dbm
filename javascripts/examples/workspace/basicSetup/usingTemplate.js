dbm.runTempFunction(function() {
	//"use strict";
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var SplitLayoutAreaPart = dbm.importClass("com.developedbyme.workspace.gui.parts.areas.layout.SplitLayoutAreaPart");
	var SizedElementAreaPart = dbm.importClass("com.developedbyme.workspace.gui.parts.areas.SizedElementAreaPart");
	
	var WindowSizeNode = dbm.importClass("com.developedbyme.flow.nodes.browser.WindowSizeNode");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var DomManipulationFunctions = dbm.importClass("com.developedbyme.utils.htmldom.DomManipulationFunctions");
	
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var visualTemplatesPath = "../assets/examples/workspace/basicSetup/visualTemplates.html#mainWorkspace";
		
		var fileLoaded = function(aLoader) {
			console.log("fileLoaded");
			
			var windowSizeNode = WindowSizeNode.create(window);
			windowSizeNode.start();
			
			var templateElement = dbm.singletons.dbmAssetRepository.getAssetData(visualTemplatesPath);
			var importedTemplateElement = DomManipulationFunctions.importNode(templateElement, true, dbm.getDocument());
			importedTemplateElement.id = null;
			
			var templateResult = dbm.singletons.dbmTemplateManager.createControllersForTemplate(importedTemplateElement);
			
			var mainWorkspace = templateResult.mainController;
			mainWorkspace.addToParent(dbm.getDocument().body);
			
			mainWorkspace.setElementAsPositioned();
			mainWorkspace.setElementAsSized();
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
			
			//Elements
			var areaElement1 = templateResult.getController("area1");
			areaElement1.setElementAsPositioned();
			areaElement1.setElementAsSized();
			
			var areaElement2 = templateResult.getController("area2");
			areaElement2.setElementAsPositioned();
			areaElement2.setElementAsSized();
			
			var areaElement3 = templateResult.getController("area2/area3");
			areaElement3.setElementAsPositioned();
			areaElement3.setElementAsSized();
			
			//Set areas
			var area1 = SizedElementAreaPart.create(areaElement1);
			mainWorkspace.addPart("main/splitLayout/area1", area1);
			
			var area2 = SizedElementAreaPart.create(areaElement2);
			mainWorkspace.addPart("main/splitLayout/area2", area2);
			
			var area3 = SizedElementAreaPart.create(areaElement3);
			mainWorkspace.addPart("main/splitLayout/area2/splitLayout/area2", area3);
			
			//Start updates
			mainWorkspace.getProperty("display").startUpdating();
			areaElement1.getProperty("display").startUpdating();
			areaElement2.getProperty("display").startUpdating();
			areaElement3.getProperty("display").startUpdating();
		};
		
		var templateLoader = dbm.singletons.dbmAssetRepository.getAsset(visualTemplatesPath);
		templateLoader.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, fileLoaded, []));
		templateLoader.load();
	});
});