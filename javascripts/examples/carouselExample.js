dbm.runTempFunction(function() {
	
	var GlobalTimeNode = dbm.importClass("com.developedbyme.flow.nodes.time.GlobalTimeNode");
	var WindowSizeNode = dbm.importClass("com.developedbyme.flow.nodes.browser.WindowSizeNode");
	var PlaceElementNode = dbm.importClass("com.developedbyme.flow.nodes.display.PlaceElementNode");
	var PropertiesHolder = dbm.importClass("com.developedbyme.flow.PropertiesHolder");
	var AdditionNode = dbm.importClass("com.developedbyme.flow.nodes.math.AdditionNode");
	var SubtractionNode = dbm.importClass("com.developedbyme.flow.nodes.math.SubtractionNode");
	var MultiplicationNode = dbm.importClass("com.developedbyme.flow.nodes.math.MultiplicationNode");
	var PrintTextNode = dbm.importClass("com.developedbyme.flow.nodes.display.PrintTextNode");
	var FlowGroup = dbm.importClass("com.developedbyme.flow.FlowGroup");
	var MousePositionNode = dbm.importClass("com.developedbyme.flow.nodes.userinput.MousePositionNode");
	var SimpleSpeedNode = dbm.importClass("com.developedbyme.flow.nodes.incrementation.SimpleSpeedNode");
	var RangeNode = dbm.importClass("com.developedbyme.flow.nodes.math.range.RangeNode");
	var SinNode = dbm.importClass("com.developedbyme.flow.nodes.math.trigonometry.SinNode");
	var CosNode = dbm.importClass("com.developedbyme.flow.nodes.math.trigonometry.CosNode");
	var ScaleZNode = dbm.importClass("com.developedbyme.flow.nodes.math.transformation.ScaleZNode");
	var IterativeFlowGroup = dbm.importClass("com.developedbyme.flow.IterativeFlowGroup");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		//Items
		var numberOfItems = 10;
		var placementNodes = new Array();
		
		//Time
		var timeNode = (new GlobalTimeNode()).init();
		timeNode.start();
		
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
		var rangeNode = RangeNode.create(mousePositionNode.getProperty("x"), 0, windowSizeNode.getProperty("width"), -1, 1);
		
		//Mouse speed multiplier
		var mouseSpeedMultiplier = MultiplicationNode.create(rangeNode.getProperty("outputValue"), 180/180*Math.PI);
		
		//Movement
		var movementNode = SimpleSpeedNode.create(timeNode.getProperty("time"), 0, mouseSpeedMultiplier.getProperty("outputValue"));
		
		//Iteration offset length
		var iterationMovementLengthNode = MultiplicationNode.create(null, 2*Math.PI/numberOfItems);
		
		//Iteraction offset
		var iterationMovementNode = AdditionNode.create(movementNode.getProperty("outputValue"), iterationMovementLengthNode.getProperty("outputValue"));
		
		//Y offset
		var movementOffset = AdditionNode.create(iterationMovementNode.getProperty("outputValue"), -0.25*Math.PI);
		
		//Position
		var xPosition = CosNode.create(iterationMovementNode.getProperty("outputValue"));
		var yPosition = CosNode.create(movementOffset.getProperty("outputValue"));
		var zPosition = SinNode.create(iterationMovementNode.getProperty("outputValue"));
		
		var xScale = MultiplicationNode.create(xPosition.getProperty("outputValue"), 300);
		var yScale = MultiplicationNode.create(yPosition.getProperty("outputValue"), 20);
		var zScale = MultiplicationNode.create(zPosition.getProperty("outputValue"), 200);
		
		//Depth scale
		var depthScale = ScaleZNode.create(zScale.getProperty("outputValue"), 300);
		
		var boxXScale = MultiplicationNode.create(160, depthScale.getProperty("scale"));
		var boxYScale = MultiplicationNode.create(90, depthScale.getProperty("scale"));
		
		//Offset box x for z
		var zOffsetX = MultiplicationNode.create(xScale.getProperty("outputValue"), depthScale.getProperty("scale"));
		var zOffsetY = MultiplicationNode.create(yScale.getProperty("outputValue"), depthScale.getProperty("scale"));
		
		//Center on screen
		var centerX = AdditionNode.create(zOffsetX.getProperty("outputValue"), scalePoint.getOutputProperty("x"));
		var centerY = AdditionNode.create(zOffsetY.getProperty("outputValue"), scalePoint.getOutputProperty("y"));
		
		//Box offset
		var halfBoxWidth = MultiplicationNode.create(boxXScale.getProperty("outputValue"), 0.5);
		var halfBoxHeight = MultiplicationNode.create(boxYScale.getProperty("outputValue"), 0.5);
		
		var boxCenterOffsetX = SubtractionNode.create(centerX.getProperty("outputValue"), halfBoxWidth.getProperty("outputValue"));
		var boxCenterOffsetY = SubtractionNode.create(centerY.getProperty("outputValue"), halfBoxHeight.getProperty("outputValue"));
		
		//Iteration group
		var iterativeFlowGroup = IterativeFlowGroup.create({}, {x: boxCenterOffsetX.getProperty("outputValue"), y: boxCenterOffsetY.getProperty("outputValue"), z: zScale.getProperty("outputValue"), width: boxXScale.getProperty("outputValue"), height: boxYScale.getProperty("outputValue")});
		iterationMovementLengthNode.setPropertyInput("inputValue1", iterativeFlowGroup.getInputProperty("index"));
		
		for(var i = 0; i < numberOfItems; i++) {
			
			//Place element
			var placeElementNode = PlaceElementNode.create(document.getElementById("placement" + (i+1)));
			placementNodes.push(placeElementNode);
			
			iterativeFlowGroup.addIteration({}, {x: placeElementNode.getProperty("x"), y: placeElementNode.getProperty("y"), z: placeElementNode.getProperty("z"), width: placeElementNode.getProperty("width"), height: placeElementNode.getProperty("height")});
		}
		
		for(var i = 0; i < numberOfItems; i++) {
			dbm.singletons.dbmFlowManager.addUpdatedProperty(placementNodes[i].getProperty("display"));
		}
	});
});