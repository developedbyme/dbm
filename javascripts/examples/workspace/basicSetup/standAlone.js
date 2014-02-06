dbm.runTempFunction(function() {
	//"use strict";
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var Workspace = dbm.importClass("com.developedbyme.workspace.gui.Workspace");
	var SplitLayoutAreaPart = dbm.importClass("com.developedbyme.workspace.gui.parts.areas.layout.SplitLayoutAreaPart");
	var SizedElementAreaPart = dbm.importClass("com.developedbyme.workspace.gui.parts.areas.SizedElementAreaPart");
	var DisplayBaseObject = dbm.importClass("com.developedbyme.gui.DisplayBaseObject");
	
	var WindowSizeNode = dbm.importClass("com.developedbyme.flow.nodes.browser.WindowSizeNode");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var windowSizeNode = WindowSizeNode.create(window);
		windowSizeNode.start();
		
		var mainWorkspace = Workspace.createOnParent(document.body);
		mainWorkspace.setElementAsPositioned();
		mainWorkspace.setElementAsSized();
		mainWorkspace.setPropertyInput("width", windowSizeNode.getProperty("width"));
		mainWorkspace.setPropertyInput("height", windowSizeNode.getProperty("height"));
		mainWorkspace.linkElementSizeToWorkspaceArea();
		
		mainWorkspace.getProperty("display").startUpdating();
		
		var splitLayout = SplitLayoutAreaPart.create();
		splitLayout.setupHorizontalSplit();
		splitLayout.setPropertyInput("splitOffset", 30);
		
		mainWorkspace.addPart("main/splitLayout", splitLayout);
		
		var areaElement1 = DisplayBaseObject.createNewDiv({"name": "Area 1", "style": "position: absolute; overflow: hidden; background-color: #FF0000;"});
		areaElement1.setElementAsPositioned();
		areaElement1.setElementAsSized();
		areaElement1.getProperty("display").startUpdating();
		areaElement1.addToDom();
		
		var area1 = SizedElementAreaPart.create(areaElement1);
		mainWorkspace.addPart("main/splitLayout/area1", area1);
		
		var areaElement2 = DisplayBaseObject.createNewDiv({"name": "Area 2", "style": "position: absolute; overflow: hidden; background-color: #00FF00;"});
		areaElement2.setElementAsPositioned();
		areaElement2.setElementAsSized();
		areaElement2.getProperty("display").startUpdating();
		areaElement2.addToDom();
		
		var area2 = SizedElementAreaPart.create(areaElement2);
		mainWorkspace.addPart("main/splitLayout/area2", area2);
		
		var splitLayout2 = SplitLayoutAreaPart.create();
		splitLayout2.setupVerticalSplit();
		splitLayout2.setPropertyInput("splitPosition", 0.8);
		
		mainWorkspace.addPart("main/splitLayout/area2/splitLayout", splitLayout2);
		
		var areaElement3 = DisplayBaseObject.createNewDiv({"name": "Area 3", "style": "position: absolute; overflow: hidden; background-color: #0000FF;"});
		areaElement3.setElementAsPositioned();
		areaElement3.setElementAsSized();
		areaElement3.getProperty("display").startUpdating();
		areaElement3.addToDom();
		
		var area3 = SizedElementAreaPart.create(areaElement3);
		mainWorkspace.addPart("main/splitLayout/area2/splitLayout/area2", area3);
	});
});