dbm.runTempFunction(function() {
	//"use strict";
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var Workspace = dbm.importClass("dbm.workspace.gui.Workspace");
	var EditableCurvePart = dbm.importClass("dbm.workspace.gui.parts.curves.EditableCurvePart");
	var CanvasView = dbm.importClass("dbm.gui.canvas.CanvasView");
	var ScrollableAreaPart = dbm.importClass("dbm.workspace.gui.parts.areas.ScrollableAreaPart");
	var SplitLayoutAreaPart = dbm.importClass("dbm.workspace.gui.parts.areas.layout.SplitLayoutAreaPart");
	var SizedElementAreaPart = dbm.importClass("dbm.workspace.gui.parts.areas.SizedElementAreaPart");
	var DisplayBaseObject = dbm.importClass("dbm.gui.DisplayBaseObject");
	
	var PressButton = dbm.importClass("dbm.gui.buttons.PressButton");
	
	var WindowSizeNode = dbm.importClass("dbm.flow.nodes.browser.WindowSizeNode");
	var RectangleFromValuesNode = dbm.importClass("dbm.flow.nodes.math.geometry.RectangleFromValuesNode");
	var FlowHandler = dbm.importClass("dbm.core.globalobjects.errormanager.handlers.FlowHandler");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	var SetupPlacementFunctions = dbm.importClass("dbm.flow.setup.display.SetupPlacementFunctions");
	var SetupErrorReportFunctions = dbm.importClass("dbm.flow.setup.workspace.SetupErrorReportFunctions");
	
	var ButtonExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ButtonExtendedEventIds");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var windowSizeNode = WindowSizeNode.create(window);
		windowSizeNode.start();
		
		var rectangleNode = RectangleFromValuesNode.create(0, 0, windowSizeNode.getProperty("width"), windowSizeNode.getProperty("height"));
		
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
		
		/*
		var testButton = PressButton.createButton(mainWorkspace.getElement(), true, {}, "Test");
		//testButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.PRESS, CallFunctionCommand.createCommand(window, alert, ["Button pressed"]));
		//testButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.PRESS, CallFunctionCommand.createCommand(window, alert, ["Button clicked"]));
		testButton.activate();
		
		console.log(mainWorkspace);
		
		var canvas = CanvasView.create(mainWorkspace.getElement(), true, "2d");
		
		console.log(canvas);
		
		var curve = dbm.singletons["dbmCurveCreator"].createStar(7, [10, 5]);
		
		canvas.getController().getLayer("test/test").setPropertyInput("x", 20);
		canvas.getController().getLayer("test/test").setPropertyInput("y", 20);
		
		var curveEditor = EditableCurvePart.create(canvas.getController().getLayer("test/test"), curve);
		
		console.log(curveEditor, canvas);
		
		canvas.getController().debugTraceStructure();
		canvas.getController().getProperty("display").startUpdating();
		
		var scrollableArea = ScrollableAreaPart.create();
		mainWorkspace.addPart(scrollableArea);
		
		console.log(scrollableArea);
		*/
	});
});