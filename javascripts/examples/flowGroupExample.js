dbm.runTempFunction(function() {
	
	var PropertiesHolder = dbm.importClass("com.developedbyme.flow.PropertiesHolder");
	var MultiplicationNode = dbm.importClass("com.developedbyme.flow.nodes.math.MultiplicationNode");
	var PrintTextNode = dbm.importClass("com.developedbyme.flow.nodes.display.PrintTextNode");
	var FlowGroup = dbm.importClass("com.developedbyme.flow.FlowGroup");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		//Input
		var inputPropertiesHolder = (new PropertiesHolder()).init();
		inputPropertiesHolder.createProperty("x", 200).setAsDirty();
		inputPropertiesHolder.createProperty("y", 100).setAsDirty();
		
		//Group
		var scalePoint = (new FlowGroup()).init();
		scalePoint.createInputProperty("x", 0);
		scalePoint.createInputProperty("y", 0);
		scalePoint.createOutputProperty("x", 0);
		scalePoint.createOutputProperty("y", 0);
		scalePoint.createInputProperty("scale", 0.4).setAsDirty();
		
		dbm.singletons.dbmFlowManager.connectProperties(inputPropertiesHolder.getProperty("x"), scalePoint.getInputProperty("x"));
		dbm.singletons.dbmFlowManager.connectProperties(inputPropertiesHolder.getProperty("y"), scalePoint.getInputProperty("y"));
		
		var scaleXNode = (new MultiplicationNode()).init();
		dbm.singletons.dbmFlowManager.connectProperties(scalePoint.getInputProperty("x"), scaleXNode.getProperty("inputValue1"));
		dbm.singletons.dbmFlowManager.connectProperties(scalePoint.getInputProperty("scale"), scaleXNode.getProperty("inputValue2"));
		dbm.singletons.dbmFlowManager.connectProperties(scaleXNode.getProperty("outputValue"), scalePoint.getOutputProperty("x"));
		
		var scaleYNode = (new MultiplicationNode()).init();
		dbm.singletons.dbmFlowManager.connectProperties(scalePoint.getInputProperty("y"), scaleYNode.getProperty("inputValue1"));
		dbm.singletons.dbmFlowManager.connectProperties(scalePoint.getInputProperty("scale"), scaleYNode.getProperty("inputValue2"));
		dbm.singletons.dbmFlowManager.connectProperties(scaleYNode.getProperty("outputValue"), scalePoint.getOutputProperty("y"));
		
		//Output
		var outputPropertiesHolder = (new PropertiesHolder()).init();
		outputPropertiesHolder.createProperty("x", 0);
		outputPropertiesHolder.createProperty("y", 0);
		
		dbm.singletons.dbmFlowManager.connectProperties(scalePoint.getOutputProperty("x"), outputPropertiesHolder.getProperty("x"));
		dbm.singletons.dbmFlowManager.connectProperties(scalePoint.getOutputProperty("y"), outputPropertiesHolder.getProperty("y"));
		
		//Display
		var printXTextNode = (new PrintTextNode()).init();
		printXTextNode.getProperty("element").setValue(document.getElementById("positionX"));
		dbm.singletons.dbmFlowManager.connectProperties(outputPropertiesHolder.getProperty("x"), printXTextNode.getProperty("text"));
		
		var printYTextNode = (new PrintTextNode()).init();
		printYTextNode.getProperty("element").setValue(document.getElementById("positionY"));
		dbm.singletons.dbmFlowManager.connectProperties(outputPropertiesHolder.getProperty("y"), printYTextNode.getProperty("text"));
		
		//Update flow
		dbm.singletons.dbmFlowManager.updateProperty(printXTextNode.getProperty("display"));
		dbm.singletons.dbmFlowManager.updateProperty(printYTextNode.getProperty("display"));
	});
});