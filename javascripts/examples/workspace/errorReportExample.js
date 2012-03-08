dbm.runTempFunction(function() {
	
	var HtmlPanel = dbm.importClass("com.developedbyme.workspace.gui.panels.HtmlPanel");
	
	var WindowSizeNode = dbm.importClass("com.developedbyme.flow.nodes.browser.WindowSizeNode");
	var RectangleFromValuesNode = dbm.importClass("com.developedbyme.flow.nodes.math.geometry.RectangleFromValuesNode");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var htmlPanel = HtmlPanel.createOnParent(document.body);
		console.log(htmlPanel);
		
		var windowSizeNode = WindowSizeNode.create(window);
		windowSizeNode.start();
		
		var rectangleNode = RectangleFromValuesNode.create(0, 0, windowSizeNode.getProperty("width"), windowSizeNode.getProperty("height"));
		htmlPanel.setPropertyInput("inputArea", rectangleNode.getProperty("outputRectangle"));
		
		htmlPanel.getProperty("display").update();
	});
});