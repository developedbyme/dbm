dbm.runTempFunction(function() {
	
	var AdditionNode = dbm.importClass("com.developedbyme.flow.nodes.math.AdditionNode");
	var PrintTextNode = dbm.importClass("com.developedbyme.flow.nodes.display.PrintTextNode");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var additionNode = (new AdditionNode()).init();
		additionNode.getProperty("inputValue1").setValue(2);
		additionNode.getProperty("inputValue2").setValue(3);
		
		var additionNode2 = (new AdditionNode()).init();
		additionNode2.getProperty("inputValue2").setValue(4);
		
		dbm.singletons.dbmFlowManager.connectProperties(additionNode.getProperty("outputValue"), additionNode2.getProperty("inputValue1"));
		
		var printTextNode = (new PrintTextNode()).init();
		dbm.singletons.dbmFlowManager.connectProperties(additionNode2.getProperty("outputValue"), printTextNode.getProperty("text"));
		
		dbm.singletons.dbmFlowManager.updateProperty(printTextNode.getProperty("display"));
		console.log(additionNode2.getProperty("outputValue").getValue());
		
		console.log(additionNode2);
	});
});