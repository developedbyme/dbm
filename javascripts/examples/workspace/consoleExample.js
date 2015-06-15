dbm.runTempFunction(function() {
	//"use strict";
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var HtmlPanel = dbm.importClass("dbm.workspace.gui.panels.HtmlPanel");
	var Console = dbm.importClass("dbm.workspace.gui.console.Console");
	
	var WindowSizeNode = dbm.importClass("dbm.flow.nodes.browser.WindowSizeNode");
	var RectangleFromValuesNode = dbm.importClass("dbm.flow.nodes.math.geometry.RectangleFromValuesNode");
	var FlowHandler = dbm.importClass("dbm.core.globalobjects.errormanager.handlers.FlowHandler");
	
	var SetupPlacementFunctions = dbm.importClass("dbm.flow.setup.display.SetupPlacementFunctions");
	var SetupErrorReportFunctions = dbm.importClass("dbm.flow.setup.workspace.SetupErrorReportFunctions");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var flowHandlerNode = FlowHandler.create();
		dbm.singletons.dbmErrorManager.addHandler(flowHandlerNode);
		
		var htmlPanel = HtmlPanel.createOnParent(document.body);
		console.log(htmlPanel);
		
		var windowSizeNode = WindowSizeNode.create(window);
		windowSizeNode.start();
		
		var rectangleNode = RectangleFromValuesNode.create(0, 0, windowSizeNode.getProperty("width"), windowSizeNode.getProperty("height"));
		htmlPanel.setPropertyInput("inputArea", rectangleNode.getProperty("outputRectangle"));
		
		var consoleElement = document.getElementById("console");
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForTemplate(consoleElement);
		
		SetupPlacementFunctions.setupPositionOfDisplayObject(htmlPanel.getProperty("inputArea"), 1, 1, 1, 1, -10, -10, templateResult.mainController);
		
		console.log(templateResult.mainController);
		
		htmlPanel.getProperty("display").update();
		templateResult.mainController.getProperty("display").startUpdating();
		
		var htmlConsole = templateResult.mainController;
		htmlConsole.addTextLine("Hello World!");
		htmlConsole.addButton("Test button 1");
		htmlConsole.addButton("Test button 2");
		htmlConsole.getCurrentLine().print();
		htmlConsole.addTextLine("Line after buttons");
		htmlConsole.addButton("Test button 3");
		htmlConsole.addButton("Test button 4");
		htmlConsole.getCurrentLine().print();
	});
});