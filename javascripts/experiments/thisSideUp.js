dbm.runTempFunction(function() {
	
	var PlaceElementNode = dbm.importClass("dbm.flow.nodes.display.PlaceElementNode");
	
	var DeviceOrientation = dbm.importClass("dbm.utils.device.DeviceOrientation");
	var GlobalTimeNode = dbm.importClass("dbm.flow.nodes.time.GlobalTimeNode");
	var WindowSizeNode = dbm.importClass("dbm.flow.nodes.browser.WindowSizeNode");
	var PropertiesHolder = dbm.importClass("dbm.flow.PropertiesHolder");
	var AdditionNode = dbm.importClass("dbm.flow.nodes.math.AdditionNode");
	var SubtractionNode = dbm.importClass("dbm.flow.nodes.math.SubtractionNode");
	var MultiplicationNode = dbm.importClass("dbm.flow.nodes.math.MultiplicationNode");
	var DivisionNode = dbm.importClass("dbm.flow.nodes.math.DivisionNode");
	var PrintTextNode = dbm.importClass("dbm.flow.nodes.display.PrintTextNode");
	var FlowGroup = dbm.importClass("dbm.flow.FlowGroup");
	var IterativeFlowGroup = dbm.importClass("dbm.flow.IterativeFlowGroup");
	var HypotenuseNode = dbm.importClass("dbm.flow.nodes.math.trigonometry.HypotenuseNode");
	var MaxNode = dbm.importClass("dbm.flow.nodes.math.MaxNode");
	var CosNode = dbm.importClass("dbm.flow.nodes.math.trigonometry.CosNode");
	var SinNode = dbm.importClass("dbm.flow.nodes.math.trigonometry.SinNode");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var templateResult = dbm.singletons.dbmTemplateManager.createControllersForTemplate(document.getElementById("mainRotation"));
		
		//Static properties
		
		var staticProperties = PropertiesHolder.create({contentWidth: 500, contentHeight: 700, lineAngle: 0.1*Math.PI})
		
		var invertedLineAngle = MultiplicationNode.create(staticProperties.getProperty("lineAngle"), -1);
		
		//Orientation
		var deviceOrientation = DeviceOrientation.create();
		deviceOrientation.startUpdating();
		
		var invertedOrientation = MultiplicationNode.create(deviceOrientation.getProperty("gammaValue"), -1);
		
		//Center of page
		var windowSizeNode = (new WindowSizeNode()).init();
		windowSizeNode.start();
		
		//Scale group
		var scalePoint = FlowGroup.create({x: windowSizeNode.getProperty("width"), y: windowSizeNode.getProperty("height"), scale: 0.5}, {x: 0, y: 0});
		
		var scaleXNode = MultiplicationNode.create(scalePoint.getInputProperty("x"), scalePoint.getInputProperty("scale"));
		var scaleYNode = MultiplicationNode.create(scalePoint.getInputProperty("y"), scalePoint.getInputProperty("scale"));
		
		dbm.singletons.dbmFlowManager.connectProperties(scaleXNode.getProperty("outputValue"), scalePoint.getOutputProperty("x"));
		dbm.singletons.dbmFlowManager.connectProperties(scaleYNode.getProperty("outputValue"), scalePoint.getOutputProperty("y"));
		
		//Content scale
		
		var minHeightContentScale = HypotenuseNode.create(windowSizeNode.getProperty("width"), windowSizeNode.getProperty("height"));
		var minWidthContentScale = HypotenuseNode.create(scalePoint.getOutputProperty("x"), scalePoint.getOutputProperty("y"));
		
		var heightRatioNode = DivisionNode.create(minHeightContentScale.getProperty("outputValue"), staticProperties.getProperty("contentHeight"));
		var widthRatioNode = DivisionNode.create(minWidthContentScale.getProperty("outputValue"), staticProperties.getProperty("contentWidth"));
		
		var maxRatioNode = MaxNode.create(heightRatioNode.getProperty("outputValue"), widthRatioNode.getProperty("outputValue"));
		
		//var contentScaleXNode = MultiplicationNode.create(staticProperties.getProperty("contentWidth"), maxRatioNode.getProperty("outputValue"));
		//var contentScaleYNode = MultiplicationNode.create(staticProperties.getProperty("contentHeight"), maxRatioNode.getProperty("outputValue"));
		
		var contentScaleXNode = MultiplicationNode.create(staticProperties.getProperty("contentWidth"), 0.9);
		var contentScaleYNode = MultiplicationNode.create(staticProperties.getProperty("contentHeight"), 0.9);
		
		var halfContentScaleXNode = MultiplicationNode.create(contentScaleXNode.getProperty("outputValue"), 0.5);
		var halfContentScaleYNode = MultiplicationNode.create(contentScaleYNode.getProperty("outputValue"), 0.5);
		
		var rotationExtraMovementMultiplierNode = CosNode.create(staticProperties.getProperty("lineAngle"));
		var halfContentScaleXNode = MultiplicationNode.create(contentScaleXNode.getProperty("outputValue"), 0.5);
		var extraMovement = DivisionNode.create(halfContentScaleXNode.getProperty("outputValue"), rotationExtraMovementMultiplierNode.getProperty("outputValue"));
		
		var rightContentXNode = MultiplicationNode.create(extraMovement.getProperty("outputValue"), 1);
		var leftContentXNode = MultiplicationNode.create(rightContentXNode.getProperty("outputValue"), -1);
		
		//Display
		var mainRotation = templateResult.mainController;
		
		mainRotation.setElementAsTransformed();
		
		mainRotation.setPropertyInput("x", scalePoint.getOutputProperty("x"));
		mainRotation.setPropertyInput("y", scalePoint.getOutputProperty("y"));
		mainRotation.setPropertyInput("rotate", invertedOrientation.getProperty("outputValue"));
		
		mainRotation.getProperty("display").startUpdating();
		
		//Rotations
		
		var leftDisplay = templateResult.getController("left");
		leftDisplay.setElementAsTransformed();
		leftDisplay.setPropertyInput("x", leftContentXNode.getProperty("outputValue"));
		leftDisplay.setPropertyInput("rotate", staticProperties.getProperty("lineAngle"));
		leftDisplay.setPropertyInput("pivotX", 0.5);
		leftDisplay.setPropertyInput("pivotY", 0.5);
		
		var leftDisplayPlacement = PlaceElementNode.create(leftDisplay.getElement(), 0, 0, 0, contentScaleXNode.getProperty("outputValue"), contentScaleYNode.getProperty("outputValue"))
		leftDisplayPlacement.getProperty("display").startUpdating();
		leftDisplay.getProperty("display").startUpdating();
		
		var leftBackRotateDisplay = templateResult.getController("left/backRotate");
		leftBackRotateDisplay.setElementAsTransformed();
		leftBackRotateDisplay.setPropertyInput("x", halfContentScaleXNode.getProperty("outputValue"));
		leftBackRotateDisplay.setPropertyInput("y", halfContentScaleYNode.getProperty("outputValue"));
		leftBackRotateDisplay.setPropertyInput("rotate", invertedLineAngle.getProperty("outputValue"));
		leftBackRotateDisplay.getProperty("display").startUpdating();
		
		var leftContentDisplay = templateResult.getController("left/backRotate/content");
		leftContentDisplay.setElementAsTransformed();
		
		var leftContentDisplayPlacement = PlaceElementNode.create(leftContentDisplay.getElement(), 0, 0, 0, minHeightContentScale.getProperty("outputValue"), minHeightContentScale.getProperty("outputValue"))
		leftContentDisplayPlacement.getProperty("display").startUpdating();
		leftContentDisplay.getProperty("display").startUpdating();
		
		
		var rightDisplay = templateResult.getController("right");
		rightDisplay.setElementAsTransformed();
		rightDisplay.setPropertyInput("x", rightContentXNode.getProperty("outputValue"));
		rightDisplay.setPropertyInput("rotate", staticProperties.getProperty("lineAngle"));
		rightDisplay.setPropertyInput("pivotX", 0.5);
		rightDisplay.setPropertyInput("pivotY", 0.5);
		
		var rightDisplayPlacement = PlaceElementNode.create(rightDisplay.getElement(), 0, 0, 0, contentScaleXNode.getProperty("outputValue"), contentScaleYNode.getProperty("outputValue"))
		rightDisplayPlacement.getProperty("display").startUpdating();
		rightDisplay.getProperty("display").startUpdating();
		
		var rightBackRotateDisplay = templateResult.getController("right/backRotate");
		rightBackRotateDisplay.setElementAsTransformed();
		rightBackRotateDisplay.setPropertyInput("x", halfContentScaleXNode.getProperty("outputValue"));
		rightBackRotateDisplay.setPropertyInput("y", halfContentScaleYNode.getProperty("outputValue"));
		rightBackRotateDisplay.setPropertyInput("rotate", invertedLineAngle.getProperty("outputValue"));
		rightBackRotateDisplay.getProperty("display").startUpdating();
		
		var rightContentDisplay = templateResult.getController("right/backRotate/content");
		rightContentDisplay.setElementAsTransformed();
		
		var rightContentDisplayPlacement = PlaceElementNode.create(rightContentDisplay.getElement(), 0, 0, 0, minHeightContentScale.getProperty("outputValue"), minHeightContentScale.getProperty("outputValue"))
		rightContentDisplayPlacement.getProperty("display").startUpdating();
		rightContentDisplay.getProperty("display").startUpdating();
	});
});