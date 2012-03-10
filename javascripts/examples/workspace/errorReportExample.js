dbm.runTempFunction(function() {
	//"use strict";
	
	var HtmlPanel = dbm.importClass("com.developedbyme.workspace.gui.panels.HtmlPanel");
	
	var WindowSizeNode = dbm.importClass("com.developedbyme.flow.nodes.browser.WindowSizeNode");
	var RectangleFromValuesNode = dbm.importClass("com.developedbyme.flow.nodes.math.geometry.RectangleFromValuesNode");
	
	var SetupPlacementFunctions = dbm.importClass("com.developedbyme.flow.setup.display.SetupPlacementFunctions");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var htmlPanel = HtmlPanel.createOnParent(document.body);
		console.log(htmlPanel);
		
		var windowSizeNode = WindowSizeNode.create(window);
		windowSizeNode.start();
		
		var rectangleNode = RectangleFromValuesNode.create(0, 0, windowSizeNode.getProperty("width"), windowSizeNode.getProperty("height"));
		htmlPanel.setPropertyInput("inputArea", rectangleNode.getProperty("outputRectangle"));
		
		var errorReportElement = document.getElementById("errorReportDisplay");
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForTemplate(errorReportElement);
		
		SetupPlacementFunctions.setupPositionOfDisplayObject(htmlPanel.getProperty("inputArea"), 1, 1, 1, 1, -10, -10, templateResult.mainController);
		
		console.log(templateResult.mainController);
		
		htmlPanel.getProperty("display").update();
		templateResult.mainController.getProperty("display").startUpdating();
	});
});