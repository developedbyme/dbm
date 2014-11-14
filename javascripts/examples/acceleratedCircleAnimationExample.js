dbm.runTempFunction(function() {
	
	var PlaceElementNode = dbm.importClass("com.developedbyme.flow.nodes.display.PlaceElementNode");
	var RepeatedRangeNode = dbm.importClass("com.developedbyme.flow.nodes.math.range.RepeatedRangeNode");
	
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
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var htmlCreator = dbm.singletons["dbmHtmlDomManager"].getHtmlCreator(document);
		
		var animationTime = 2;
		
		var repeatedRangeNode = RepeatedRangeNode.create(dbm.singletons.dbmAnimationManager.globalTimeProperty, 0, animationTime+1);
		dbm.singletons.dbmAnimationManager.globalTimeProperty = repeatedRangeNode.getProperty("outputValue");
		
		//Center of page
		var windowSizeNode = (new WindowSizeNode()).init();
		windowSizeNode.start();
		
		//Group
		var scalePoint = FlowGroup.create({x: windowSizeNode.getProperty("width"), y: windowSizeNode.getProperty("height"), scale: 0.5}, {x: 0, y: 0});
		
		var scaleXNode = MultiplicationNode.create(scalePoint.getInputProperty("x"), scalePoint.getInputProperty("scale"));
		var scaleYNode = MultiplicationNode.create(scalePoint.getInputProperty("y"), scalePoint.getInputProperty("scale"));
		
		dbm.singletons.dbmFlowManager.connectProperties(scaleXNode.getProperty("outputValue"), scalePoint.getOutputProperty("x"));
		dbm.singletons.dbmFlowManager.connectProperties(scaleYNode.getProperty("outputValue"), scalePoint.getOutputProperty("y"));
		
		//Timeline
		var newTimeline = dbm.singletons.dbmAnimationManager.createTimeline(0, null);
		newTimeline.animateValue(Math.PI, 0.5*animationTime, InterpolationTypes.QUADRATIC, 0);
		newTimeline.animateValue(2*Math.PI, 0.5*animationTime, InterpolationTypes.INVERTED_QUADRATIC, 0.5*animationTime);
		
		//Position
		var xPosition = SinNode.create(newTimeline.getProperty("outputValue"));
		var yPosition = CosNode.create(newTimeline.getProperty("outputValue"));
		
		var xScale = MultiplicationNode.create(xPosition.getProperty("outputValue"), 200);
		var yScale = MultiplicationNode.create(yPosition.getProperty("outputValue"), 200);
		
		//Center on screen
		var centerX = AdditionNode.create(xScale.getProperty("outputValue"), scalePoint.getOutputProperty("x"));
		var centerY = AdditionNode.create(yScale.getProperty("outputValue"), scalePoint.getOutputProperty("y"));
		
		//Box offset
		var halfBoxWidth = MultiplicationNode.create(50, 0.5);
		var halfBoxHeight = MultiplicationNode.create(50, 0.5);
		
		var boxCenterOffsetX = SubtractionNode.create(centerX.getProperty("outputValue"), halfBoxWidth.getProperty("outputValue"));
		var boxCenterOffsetY = SubtractionNode.create(centerY.getProperty("outputValue"), halfBoxHeight.getProperty("outputValue"));
		
		//Node
		var newNode = htmlCreator.createNode("div", {style: "position: absolute; background-color: #FF0000"});
		document.body.appendChild(newNode);
			
		var placeElementNode = PlaceElementNode.create(newNode, boxCenterOffsetX.getProperty("outputValue"), boxCenterOffsetY.getProperty("outputValue"), 0, 50, 50);
		placeElementNode.getProperty("display").startUpdating();
	});
});