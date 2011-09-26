dbm.runTempFunction(function() {
	
	var MousePositionNode = dbm.importClass("com.developedbyme.flow.nodes.userinput.MousePositionNode");
	var PrintTextNode = dbm.importClass("com.developedbyme.flow.nodes.display.PrintTextNode");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var mousePositionNode = (new MousePositionNode()).init();
		mousePositionNode.start();
		
		var printXTextNode = (new PrintTextNode()).init();
		printXTextNode.getProperty("element").setValue(document.getElementById("positionX"));
		dbm.singletons.dbmFlowManager.connectProperties(mousePositionNode.getProperty("x"), printXTextNode.getProperty("text"));
		
		var printYTextNode = (new PrintTextNode()).init();
		printYTextNode.getProperty("element").setValue(document.getElementById("positionY"));
		dbm.singletons.dbmFlowManager.connectProperties(mousePositionNode.getProperty("y"), printYTextNode.getProperty("text"));
		
		dbm.singletons.dbmFlowManager.addUpdatedProperty(printXTextNode.getProperty("display"));
		dbm.singletons.dbmFlowManager.addUpdatedProperty(printYTextNode.getProperty("display"));
	});
});