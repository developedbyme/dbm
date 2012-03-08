dbm.runTempFunction(function() {
	
	var PlaceElementNode = dbm.importClass("com.developedbyme.flow.nodes.display.PlaceElementNode");
	var RepeadedRange = dbm.importClass("com.developedbyme.flow.nodes.math.range.RepeatedRangeNode");
	
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
	var TransformElementNode = dbm.importClass("com.developedbyme.flow.nodes.display.TransformElementNode");
	var SizeOfElementNode = dbm.importClass("com.developedbyme.flow.nodes.display.SizeOfElementNode");
	
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var htmlCreator = dbm.singletons["dbmHtmlDomManager"].getHtmlCreator(document);
		
		var animationTime = 2;
		
		var repeatedRangeNode = RepeadedRange.create(dbm.singletons.dbmAnimationManager.globalTimeProperty, 0, animationTime+1);
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
		newTimeline.animateValue(180, 0.5*animationTime, InterpolationTypes.QUADRATIC, 0);
		newTimeline.animateValue(360, 0.5*animationTime, InterpolationTypes.INVERTED_QUADRATIC, 0.5*animationTime);
		
		var scaleTimeline = dbm.singletons.dbmAnimationManager.createTimeline(1, null);
		scaleTimeline.animateValue(1.5, 0.5*animationTime, InterpolationTypes.QUADRATIC, 0+0.2);
		scaleTimeline.animateValue(1, 0.5*animationTime, InterpolationTypes.INVERTED_QUADRATIC, 0.5*animationTime+0.2);
		
		//Node
		var newNode = htmlCreator.createNode("div", {style: "font-size: 64px; display: inline-block;"}, "Look at me spin");
		document.body.appendChild(newNode);
		//document.body.appendChild(htmlCreator.createNode("div", {style: "background-color: #FF0000;"}, "After"));
		
		//Transform
		var transformElementNode = TransformElementNode.create(newNode, scalePoint.getOutputProperty("x"), scalePoint.getOutputProperty("y"), scaleTimeline.getProperty("outputValue"), scaleTimeline.getProperty("outputValue"), newTimeline.getProperty("outputValue"));
		transformElementNode.getProperty("display").update();
		transformElementNode.getProperty("display").startUpdating();
	});
});