dbm.runTempFunction(function() {
	
	var PlaceElementNode = dbm.importClass("dbm.flow.nodes.display.PlaceElementNode");
	var RepeatedRangeNode = dbm.importClass("dbm.flow.nodes.math.range.RepeatedRangeNode");
	
	var GlobalTimeNode = dbm.importClass("dbm.flow.nodes.time.GlobalTimeNode");
	var WindowSizeNode = dbm.importClass("dbm.flow.nodes.browser.WindowSizeNode");
	var PlaceElementNode = dbm.importClass("dbm.flow.nodes.display.PlaceElementNode");
	var PropertiesHolder = dbm.importClass("dbm.flow.PropertiesHolder");
	var AdditionNode = dbm.importClass("dbm.flow.nodes.math.AdditionNode");
	var SubtractionNode = dbm.importClass("dbm.flow.nodes.math.SubtractionNode");
	var MultiplicationNode = dbm.importClass("dbm.flow.nodes.math.MultiplicationNode");
	var PrintTextNode = dbm.importClass("dbm.flow.nodes.display.PrintTextNode");
	var FlowGroup = dbm.importClass("dbm.flow.FlowGroup");
	var MousePositionNode = dbm.importClass("dbm.flow.nodes.userinput.MousePositionNode");
	var SimpleSpeedNode = dbm.importClass("dbm.flow.nodes.incrementation.SimpleSpeedNode");
	var RangeNode = dbm.importClass("dbm.flow.nodes.math.range.RangeNode");
	var SinNode = dbm.importClass("dbm.flow.nodes.math.trigonometry.SinNode");
	var CosNode = dbm.importClass("dbm.flow.nodes.math.trigonometry.CosNode");
	var ScaleZNode = dbm.importClass("dbm.flow.nodes.math.transformation.ScaleZNode");
	var IterativeFlowGroup = dbm.importClass("dbm.flow.IterativeFlowGroup");
	var TransformElementNode = dbm.importClass("dbm.flow.nodes.display.TransformElementNode");
	var SizeOfElementNode = dbm.importClass("dbm.flow.nodes.display.SizeOfElementNode");
	
	var InterpolationTypes = dbm.importClass("dbm.constants.generic.InterpolationTypes");
	
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