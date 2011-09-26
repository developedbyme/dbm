dbm.runTempFunction(function() {
	
	var GlobalTimeNode = dbm.importClass("com.developedbyme.flow.nodes.time.GlobalTimeNode");
	var PrintTextNode = dbm.importClass("com.developedbyme.flow.nodes.display.PrintTextNode");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var timeNode = (new GlobalTimeNode()).init();
		timeNode.start();
		
		var printTextNode = (new PrintTextNode()).init();
		dbm.singletons.dbmFlowManager.connectProperties(timeNode.getProperty("time"), printTextNode.getProperty("text"));
		
		dbm.singletons.dbmFlowManager.addUpdatedProperty(printTextNode.getProperty("display"));
	});
});