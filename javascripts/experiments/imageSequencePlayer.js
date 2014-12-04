dbm.runTempFunction(function() {
	
	var ImageSequencePlayer = dbm.importClass("dbm.projects.experiments.imagesequenceplayer.ImageSequencePlayer");
	
	var WindowSizeNode = dbm.importClass("dbm.flow.nodes.browser.WindowSizeNode");
	var MultiplicationNode = dbm.importClass("dbm.flow.nodes.math.MultiplicationNode");
	var FlowGroup = dbm.importClass("dbm.flow.FlowGroup");
	var MousePositionNode = dbm.importClass("dbm.flow.nodes.userinput.MousePositionNode");
	var RangeNode = dbm.importClass("dbm.flow.nodes.math.range.RangeNode");
	var RoundNode = dbm.importClass("dbm.flow.nodes.math.round.RoundNode");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		//Center of page
		var windowSizeNode = (new WindowSizeNode()).init();
		windowSizeNode.start();
		
		//Group
		var scalePoint = FlowGroup.create({x: windowSizeNode.getProperty("width"), y: windowSizeNode.getProperty("height"), scale: 0.5}, {x: 0, y: 0});
		
		var scaleXNode = MultiplicationNode.create(scalePoint.getInputProperty("x"), scalePoint.getInputProperty("scale"));
		var scaleYNode = MultiplicationNode.create(scalePoint.getInputProperty("y"), scalePoint.getInputProperty("scale"));
		
		dbm.singletons.dbmFlowManager.connectProperties(scaleXNode.getProperty("outputValue"), scalePoint.getOutputProperty("x"));
		dbm.singletons.dbmFlowManager.connectProperties(scaleYNode.getProperty("outputValue"), scalePoint.getOutputProperty("y"));
		
		//Mouse position
		var mousePositionNode = (new MousePositionNode()).init();
		mousePositionNode.start();
		
		//Mouse parameteric node
		var rangeNode = RangeNode.create(mousePositionNode.getProperty("x"), 0, windowSizeNode.getProperty("width"), 0, 700);
		
		//Round value
		var roundNode = RoundNode.create(rangeNode.getProperty("outputValue"));
		
		var newImageSequencePlayer = ImageSequencePlayer.create(0, 700);
		newImageSequencePlayer.start();
		
		newImageSequencePlayer.setPropertyInput("aimedPosition", roundNode.getProperty("outputValue"));
	});
});