dbm.runTempFunction(function() {
	
	var PropertiesHolder = dbm.importClass("com.developedbyme.flow.PropertiesHolder");
	var MultiplicationNode = dbm.importClass("com.developedbyme.flow.nodes.math.MultiplicationNode");
	var PrintTextNode = dbm.importClass("com.developedbyme.flow.nodes.display.PrintTextNode");
	var IterativeFlowGroup = dbm.importClass("com.developedbyme.flow.IterativeFlowGroup");
	var MousePositionNode = dbm.importClass("com.developedbyme.flow.nodes.userinput.MousePositionNode");
	var AdditionNode = dbm.importClass("com.developedbyme.flow.nodes.math.AdditionNode");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var valuesArray = [10, 30, 40, 50, 80, 100, 150, 123, 200];
		var printNodes = new Array();
		
		//Iteration group
		var iterativeFlowGroup = (new IterativeFlowGroup()).init();
		
		
		//Iterations
		for(var i = 0; i < 9; i++) {
			
			//Input
			var inputPropertiesHolder = (new PropertiesHolder()).init();
			inputPropertiesHolder.createProperty("x", valuesArray[i]).setAsDirty();
			
			//Display
			var printXTextNode = (new PrintTextNode()).init();
			printXTextNode.getProperty("element").setValue(document.getElementById("field" + (i+1)));
			printNodes.push(printXTextNode);
			
			//Add iteration
			iterativeFlowGroup.addIteration({x: inputPropertiesHolder.getProperty("x")}, {output: printXTextNode.getProperty("text")});
		}
		
		//Group connections
		
		var mousePositionNode = (new MousePositionNode()).init();
		mousePositionNode.start();
		
		var additionNode = (new AdditionNode()).init();
		dbm.singletons.dbmFlowManager.connectProperties(iterativeFlowGroup.getInputProperty("x"), additionNode.getProperty("inputValue1"));
		dbm.singletons.dbmFlowManager.connectProperties(mousePositionNode.getProperty("x"), additionNode.getProperty("inputValue2"));
		
		var scaleNode = (new MultiplicationNode()).init();
		scaleNode.getProperty("inputValue2").setValue(0.5);
		dbm.singletons.dbmFlowManager.connectProperties(additionNode.getProperty("outputValue"), scaleNode.getProperty("inputValue1"));
		dbm.singletons.dbmFlowManager.connectProperties(scaleNode.getProperty("outputValue"), iterativeFlowGroup.getOutputProperty("output"));
		
		
		//Update flow
		for(var i = 0; i < 9; i++) {
			//dbm.singletons.dbmFlowManager.updateProperty(printNodes[i].getProperty("display"));
			dbm.singletons.dbmFlowManager.addUpdatedProperty(printNodes[i].getProperty("display"));
		}
	});
});