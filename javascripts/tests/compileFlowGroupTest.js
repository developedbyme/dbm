dbm.runTempFunction(function() {
	
	var GlobalTimeNode = dbm.importClass("com.developedbyme.flow.nodes.time.GlobalTimeNode");
	var WindowSizeNode = dbm.importClass("com.developedbyme.flow.nodes.browser.WindowSizeNode");
	var PropertiesHolder = dbm.importClass("com.developedbyme.flow.PropertiesHolder");
	var AdditionNode = dbm.importClass("com.developedbyme.flow.nodes.math.AdditionNode");
	var SubtractionNode = dbm.importClass("com.developedbyme.flow.nodes.math.SubtractionNode");
	var MultiplicationNode = dbm.importClass("com.developedbyme.flow.nodes.math.MultiplicationNode");
	var DivisionNode = dbm.importClass("com.developedbyme.flow.nodes.math.DivisionNode");
	var FlowGroup = dbm.importClass("com.developedbyme.flow.FlowGroup");
	
	var FlowCompiler = dbm.importClass("com.developedbyme.flow.compiler.FlowCompiler");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var windowSizeNode = (new WindowSizeNode()).init();
		
		//Scale group
		var scalePoint = FlowGroup.create({x: windowSizeNode.getProperty("width"), y: windowSizeNode.getProperty("height"), scale: 0.5, moveLengthScale: 0.4, maxWidthScale: 0.8}, {x: 0, y: 0, moveLength: 0, maxWidth: 0, halfMaxWidth: 0});
		
		var scaleXNode = MultiplicationNode.create(scalePoint.getInputProperty("x"), scalePoint.getInputProperty("scale"));
		var scaleYNode = MultiplicationNode.create(scalePoint.getInputProperty("y"), scalePoint.getInputProperty("scale"));
		
		var scaleLengthNode = MultiplicationNode.create(scalePoint.getInputProperty("y"), scalePoint.getInputProperty("moveLengthScale"));
		var scaleMaxWidthNode = MultiplicationNode.create(scalePoint.getInputProperty("x"), scalePoint.getInputProperty("maxWidthScale"));
		var halfMaxWidthNode = MultiplicationNode.create(scaleMaxWidthNode.getProperty("outputValue"), 0.5);
		
		dbm.singletons.dbmFlowManager.connectProperties(scaleXNode.getProperty("outputValue"), scalePoint.getOutputProperty("x"));
		dbm.singletons.dbmFlowManager.connectProperties(scaleYNode.getProperty("outputValue"), scalePoint.getOutputProperty("y"));
		dbm.singletons.dbmFlowManager.connectProperties(scaleLengthNode.getProperty("outputValue"), scalePoint.getOutputProperty("moveLength"));
		dbm.singletons.dbmFlowManager.connectProperties(scaleMaxWidthNode.getProperty("outputValue"), scalePoint.getOutputProperty("maxWidth"));
		dbm.singletons.dbmFlowManager.connectProperties(halfMaxWidthNode.getProperty("outputValue"), scalePoint.getOutputProperty("halfMaxWidth"));
		
		var compiler = FlowCompiler.create();
		var compiledCode = compiler.compileGroup(scalePoint);
		
		console.log(compiledCode);
	});
});