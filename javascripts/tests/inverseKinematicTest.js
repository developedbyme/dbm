dbm.runTempFunction(function() {
	
	var DisplayBaseObject = dbm.importClass("dbm.gui.DisplayBaseObject");
	
	var WindowSizeNode = dbm.importClass("dbm.flow.nodes.browser.WindowSizeNode");
	var MultiplicationNode = dbm.importClass("dbm.flow.nodes.math.MultiplicationNode");
	var SubtractionNode = dbm.importClass("dbm.flow.nodes.math.SubtractionNode");
	var FlowGroup = dbm.importClass("dbm.flow.FlowGroup");
	var MousePositionNode = dbm.importClass("dbm.flow.nodes.userinput.MousePositionNode");
	var RangeNode = dbm.importClass("dbm.flow.nodes.math.range.RangeNode");
	var RoundNode = dbm.importClass("dbm.flow.nodes.math.round.RoundNode");
	var SquareRootNode = dbm.importClass("dbm.flow.nodes.math.SquareRootNode");
	var PowerNode = dbm.importClass("dbm.flow.nodes.math.PowerNode");
	var AdditionNode = dbm.importClass("dbm.flow.nodes.math.AdditionNode");
	var Atan2Node = dbm.importClass("dbm.flow.nodes.math.trigonometry.Atan2Node");
	var SinNode = dbm.importClass("dbm.flow.nodes.math.trigonometry.SinNode");
	var CosNode = dbm.importClass("dbm.flow.nodes.math.trigonometry.CosNode");
	
	var PointSet = dbm.importClass("dbm.core.data.points.PointSet");
	var BezierCurve = dbm.importClass("dbm.core.data.curves.BezierCurve");
	var CreateMultiSegmentBezierCurveNode = dbm.importClass("dbm.flow.nodes.curves.CreateMultiSegmentBezierCurveNode");
	var PointFromValuesNode = dbm.importClass("dbm.flow.nodes.points.PointFromValuesNode");
	var AdjustPointsInPointSetNode = dbm.importClass("dbm.flow.nodes.points.AdjustPointsInPointSetNode");
	
	var InverseKinematicsNode = dbm.importClass("dbm.flow.nodes.math.trigonometry.InverseKinematicsNode");
	
	var CanvasView = dbm.importClass("dbm.gui.canvas.CanvasView");
	var TouchOrMouseDetector = dbm.importClass("dbm.gui.abstract.touch.TouchOrMouseDetector");
	var MovablePointsController = dbm.importClass("dbm.gui.abstract.touch.movablepoints.MovablePointsController");
	
	var LineCapTypes = dbm.importClass("dbm.constants.LineCapTypes");
	var LineJoinTypes = dbm.importClass("dbm.constants.LineJoinTypes");
	
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
		//var rangeNodeX = RangeNode.create(mousePositionNode.getProperty("x"), 0, windowSizeNode.getProperty("width"), 0, 1);
		
		//Round value
		//var roundNodeX = RoundNode.create(rangeNodeX.getProperty("outputValue"));
		
		//Touch detection
		var touchDetector = TouchOrMouseDetector.create(dbm.getDocument().body);
		touchDetector.activate();
		var movablePointsController = MovablePointsController.create(touchDetector);
		
		//Canvas
		var canvasView = CanvasView.create(dbm.getDocument(), false, "2d", {"style": "position: absolute; left: 0px; top: 0px; width: 100%; height: 100%;"});
		canvasView.setElementAsSized();
		canvasView.setPropertyInput("width", windowSizeNode.getProperty("width"));
		canvasView.setPropertyInput("height", windowSizeNode.getProperty("height"));
		canvasView.getProperty("display").startUpdating();
		canvasView.getController().getProperty("display").startUpdating();
		
		//Body
		var centerPositionX = 300;
		var centerPositionY = 250;
		var shirtColor = "#000000";
		var pantsColor = "#6666FF";
		var skinColor = "#FF6666";
		var guitarColor = "#FA8C32";
		
		canvasView.getController().getLayer("legs");
		
		var bodyLayer = canvasView.getController().getLayer("body");
		bodyLayer.setFillStyle(shirtColor);
		bodyLayer.setPropertyInput("x", centerPositionX);
		bodyLayer.setPropertyInput("y", centerPositionY);
		bodyLayer.moveTo(-50, 50).lineTo(50, 50).lineTo(50, -50).lineTo(-50, -50).closePath();
		
		var headLayer = canvasView.getController().getLayer("face");
		headLayer.setFillStyle(skinColor);
		headLayer.setPropertyInput("x", centerPositionX);
		headLayer.setPropertyInput("y", centerPositionY-100);
		headLayer.moveTo(-50, 50).lineTo(-25, 50).quadraticCurveTo(0, 50, 0, 125).quadraticCurveTo(0, 50, 25, 50).lineTo(50, 50).lineTo(50, -50).lineTo(-50, -50).closePath();
		
		canvasView.getController().getLayer("guitar");
		canvasView.getController().getLayer("arms");
		canvasView.addToDom();
		
		var createArm = function(aName, aBaseX, aBaseY, aAimX, aAimY, aUpperLength, aLowerLength, aInversion) {
			var basePoint = movablePointsController.createPoint(aName + "/base", aBaseX, aBaseY).lock();
			var aimPoint = movablePointsController.createPoint(aName + "/aim", aAimX, aAimY);
			
			//Positions
			/*
			var basePosition = DisplayBaseObject.createDiv(dbm.getDocument(), true, {"style": "width: 10px; height: 10px; background-color: #00FF00; position: absolute; left: 0px; top: 0px;"});
			basePosition.setElementAsTransformed();
			basePosition.setPropertyInput("x", basePoint.getProperty("x"));
			basePosition.setPropertyInput("y", basePoint.getProperty("y"));
		
			basePosition.getProperty("display").startUpdating();
			*/
		
			var targetedPosition = DisplayBaseObject.createDiv(dbm.getDocument(), true, {"style": "width: 20px; height: 20px; border: 2px solid #FF0000; position: absolute; left: -2px; top: -2px;"});
			targetedPosition.setElementAsTransformed();
			targetedPosition.setPropertyInput("x", aimPoint.getProperty("x"));
			targetedPosition.setPropertyInput("y", aimPoint.getProperty("y"));
		
			targetedPosition.getProperty("display").startUpdating();
			
			//Distance
			var xLengthNode = SubtractionNode.create(aimPoint.getProperty("x"), basePoint.getProperty("x"));
			var yLengthNode = SubtractionNode.create(aimPoint.getProperty("y"), basePoint.getProperty("y"));
		
			var x2LengthNode = PowerNode.create(xLengthNode.getProperty("outputValue"), 2);
			var y2LengthNode = PowerNode.create(yLengthNode.getProperty("outputValue"), 2);
		
			var combinedLengthNode = AdditionNode.create(x2LengthNode.getProperty("outputValue"), y2LengthNode.getProperty("outputValue"));
		
			var lengthNode = SquareRootNode.create(combinedLengthNode.getProperty("outputValue"));
		
			//Inverse kinematic
			var inverseKinematicsNode = InverseKinematicsNode.create(aUpperLength, aLowerLength, lengthNode.getProperty("outputValue"));
			inverseKinematicsNode.setPropertyInput("heightMultiplier", aInversion);
		
			//Angle
			var angle = Atan2Node.create(xLengthNode.getProperty("outputValue"), yLengthNode.getProperty("outputValue"));
			var angle1Node = AdditionNode.create(angle.getProperty("outputValue"), inverseKinematicsNode.getProperty("outputAngle1"));
			var angle2Node = AdditionNode.create(angle1Node.getProperty("outputValue"), inverseKinematicsNode.getProperty("outputAngle2"));
		
			//Mid position
			var midPointXMultiplier = CosNode.create(angle1Node.getProperty("outputValue"));
			var midPointYMultiplier = SinNode.create(angle1Node.getProperty("outputValue"));
		
			var midPointX = MultiplicationNode.create(aUpperLength, midPointXMultiplier.getProperty("outputValue"));
			var midPointY = MultiplicationNode.create(aUpperLength, midPointYMultiplier.getProperty("outputValue"));
		
			var globalMidPointX = AdditionNode.create(basePoint.getProperty("x"), midPointX.getProperty("outputValue"));
			var globalMidPointY = AdditionNode.create(basePoint.getProperty("y"), midPointY.getProperty("outputValue"));
		
			//Mid position graphics
			var midPosition = DisplayBaseObject.createDiv(dbm.getDocument(), false, {"style": "width: 10px; height: 10px; background-color: #0000FF; position: absolute; left: 0px; top: 0px;"});
			midPosition.setElementAsTransformed();
			midPosition.setPropertyInput("x", globalMidPointX.getProperty("outputValue"));
			midPosition.setPropertyInput("y", globalMidPointY.getProperty("outputValue"));
		
			midPosition.getProperty("display").startUpdating();
		
			//End position
			var endPointXMultiplier = CosNode.create(angle2Node.getProperty("outputValue"));
			var endPointYMultiplier = SinNode.create(angle2Node.getProperty("outputValue"));
		
			var endPointX = MultiplicationNode.create(aLowerLength, endPointXMultiplier.getProperty("outputValue"));
			var endPointY = MultiplicationNode.create(aLowerLength, endPointYMultiplier.getProperty("outputValue"));
		
			var globalEndPointX = AdditionNode.create(midPosition.getProperty("x"), endPointX.getProperty("outputValue"));
			var globalEndPointY = AdditionNode.create(midPosition.getProperty("y"), endPointY.getProperty("outputValue"));
		
			//End position graphics
			var endPosition = DisplayBaseObject.createDiv(dbm.getDocument(), false, {"style": "width: 10px; height: 10px; background-color: #0000FF; position: absolute; left: 0px; top: 0px;"});
			endPosition.setElementAsTransformed();
			endPosition.setPropertyInput("x", globalEndPointX.getProperty("outputValue"));
			endPosition.setPropertyInput("y", globalEndPointY.getProperty("outputValue"));
		
			endPosition.getProperty("display").startUpdating();
		
			//Curve creation
			var pointSet = PointSet.createWithLength(3);
			var curve = BezierCurve.createWithLength(3, true, 10);
		
			var startPointCretor = PointFromValuesNode.create(basePoint.getProperty("x"), basePoint.getProperty("y"));
			var midPointCretor = PointFromValuesNode.create(midPosition.getProperty("x"), midPosition.getProperty("y"));
			var endPointCretor = PointFromValuesNode.create(endPosition.getProperty("x"), endPosition.getProperty("y"));
			var pointSetUpdater = AdjustPointsInPointSetNode.create();
			pointSetUpdater.setOutputPointSet(pointSet);
			pointSetUpdater.addPointAdjustment(0, startPointCretor.getProperty("outputPoint"));
			pointSetUpdater.addPointAdjustment(1, midPointCretor.getProperty("outputPoint"));
			pointSetUpdater.addPointAdjustment(2, endPointCretor.getProperty("outputPoint"));
			
			var curveCreator = CreateMultiSegmentBezierCurveNode.create(pointSetUpdater.getProperty("outputPointSet"));
			curveCreator.getProperty("inputPoints").setAlwaysUpdateFlow();
			curveCreator.setOutputCurve(curve);
			
			//Arms
			var canvasLayer = canvasView.getController().getLayer(aName+"/sleeves");
			canvasLayer.setStrokeStyle(16, shirtColor, LineCapTypes.ROUND);
			var curveDrawer = canvasLayer.drawCurve(curveCreator.getProperty("outputCurve").getValue(), 0, 1.2);
			curveDrawer.getProperty("curve").setAlwaysUpdateFlow();
			curveDrawer.setPropertyInput("curve", curveCreator.getProperty("outputCurve"));
		
			var canvasLayer = canvasView.getController().getLayer(aName+"/bare");
			canvasLayer.setStrokeStyle(16, skinColor, LineCapTypes.ROUND);
			var curveDrawer = canvasLayer.drawCurve(curveCreator.getProperty("outputCurve").getValue(), 1.2, 2);
			curveDrawer.getProperty("curve").setAlwaysUpdateFlow();
			curveDrawer.setPropertyInput("curve", curveCreator.getProperty("outputCurve"));
		};
		
		var createLeg = function(aName, aBaseX, aBaseY, aAimX, aAimY, aUpperLength, aLowerLength, aInversion) {
			var basePoint = movablePointsController.createPoint(aName + "/base", aBaseX, aBaseY).lock();
			var aimPoint = movablePointsController.createPoint(aName + "/aim", aAimX, aAimY);
			
			//Positions
			/*
			var basePosition = DisplayBaseObject.createDiv(dbm.getDocument(), true, {"style": "width: 10px; height: 10px; background-color: #00FF00; position: absolute; left: 0px; top: 0px;"});
			basePosition.setElementAsTransformed();
			basePosition.setPropertyInput("x", basePoint.getProperty("x"));
			basePosition.setPropertyInput("y", basePoint.getProperty("y"));
		
			basePosition.getProperty("display").startUpdating();
			*/
		
			var targetedPosition = DisplayBaseObject.createDiv(dbm.getDocument(), true, {"style": "width: 20px; height: 20px; border: 2px solid #FF0000; position: absolute; left: -2px; top: -2px;"});
			targetedPosition.setElementAsTransformed();
			targetedPosition.setPropertyInput("x", aimPoint.getProperty("x"));
			targetedPosition.setPropertyInput("y", aimPoint.getProperty("y"));
		
			targetedPosition.getProperty("display").startUpdating();
			
			//Distance
			var xLengthNode = SubtractionNode.create(aimPoint.getProperty("x"), basePoint.getProperty("x"));
			var yLengthNode = SubtractionNode.create(aimPoint.getProperty("y"), basePoint.getProperty("y"));
		
			var x2LengthNode = PowerNode.create(xLengthNode.getProperty("outputValue"), 2);
			var y2LengthNode = PowerNode.create(yLengthNode.getProperty("outputValue"), 2);
		
			var combinedLengthNode = AdditionNode.create(x2LengthNode.getProperty("outputValue"), y2LengthNode.getProperty("outputValue"));
		
			var lengthNode = SquareRootNode.create(combinedLengthNode.getProperty("outputValue"));
		
			//Inverse kinematic
			var inverseKinematicsNode = InverseKinematicsNode.create(aUpperLength, aLowerLength, lengthNode.getProperty("outputValue"));
			inverseKinematicsNode.setPropertyInput("heightMultiplier", aInversion);
		
			//Angle
			var angle = Atan2Node.create(xLengthNode.getProperty("outputValue"), yLengthNode.getProperty("outputValue"));
			var angle1Node = AdditionNode.create(angle.getProperty("outputValue"), inverseKinematicsNode.getProperty("outputAngle1"));
			var angle2Node = AdditionNode.create(angle1Node.getProperty("outputValue"), inverseKinematicsNode.getProperty("outputAngle2"));
		
			//Mid position
			var midPointXMultiplier = CosNode.create(angle1Node.getProperty("outputValue"));
			var midPointYMultiplier = SinNode.create(angle1Node.getProperty("outputValue"));
		
			var midPointX = MultiplicationNode.create(aUpperLength, midPointXMultiplier.getProperty("outputValue"));
			var midPointY = MultiplicationNode.create(aUpperLength, midPointYMultiplier.getProperty("outputValue"));
		
			var globalMidPointX = AdditionNode.create(basePoint.getProperty("x"), midPointX.getProperty("outputValue"));
			var globalMidPointY = AdditionNode.create(basePoint.getProperty("y"), midPointY.getProperty("outputValue"));
		
			//Mid position graphics
			var midPosition = DisplayBaseObject.createDiv(dbm.getDocument(), false, {"style": "width: 10px; height: 10px; background-color: #0000FF; position: absolute; left: 0px; top: 0px;"});
			midPosition.setElementAsTransformed();
			midPosition.setPropertyInput("x", globalMidPointX.getProperty("outputValue"));
			midPosition.setPropertyInput("y", globalMidPointY.getProperty("outputValue"));
		
			midPosition.getProperty("display").startUpdating();
		
			//End position
			var endPointXMultiplier = CosNode.create(angle2Node.getProperty("outputValue"));
			var endPointYMultiplier = SinNode.create(angle2Node.getProperty("outputValue"));
		
			var endPointX = MultiplicationNode.create(aLowerLength, endPointXMultiplier.getProperty("outputValue"));
			var endPointY = MultiplicationNode.create(aLowerLength, endPointYMultiplier.getProperty("outputValue"));
		
			var globalEndPointX = AdditionNode.create(midPosition.getProperty("x"), endPointX.getProperty("outputValue"));
			var globalEndPointY = AdditionNode.create(midPosition.getProperty("y"), endPointY.getProperty("outputValue"));
		
			//End position graphics
			var endPosition = DisplayBaseObject.createDiv(dbm.getDocument(), false, {"style": "width: 10px; height: 10px; background-color: #0000FF; position: absolute; left: 0px; top: 0px;"});
			endPosition.setElementAsTransformed();
			endPosition.setPropertyInput("x", globalEndPointX.getProperty("outputValue"));
			endPosition.setPropertyInput("y", globalEndPointY.getProperty("outputValue"));
		
			endPosition.getProperty("display").startUpdating();
		
			//Curve creation
			var curve = BezierCurve.createWithLength(1, true, 3);
		
			var startPointCretor = PointFromValuesNode.create(basePoint.getProperty("x"), basePoint.getProperty("y"));
			var midPointCretor = PointFromValuesNode.create(midPosition.getProperty("x"), midPosition.getProperty("y"));
			var endPointCretor = PointFromValuesNode.create(endPosition.getProperty("x"), endPosition.getProperty("y"));
			var pointSetUpdater = AdjustPointsInPointSetNode.create();
			pointSetUpdater.setOutputPointSet(curve);
			pointSetUpdater.addPointAdjustment(0, startPointCretor.getProperty("outputPoint"));
			pointSetUpdater.addPointAdjustment(1, midPointCretor.getProperty("outputPoint"));
			pointSetUpdater.addPointAdjustment(2, endPointCretor.getProperty("outputPoint"));
			
			//Arms
			var canvasLayer = canvasView.getController().getLayer(aName+"/top");
			canvasLayer.setStrokeStyle(32, pantsColor, LineCapTypes.ROUND);
			var curveDrawer = canvasLayer.drawCurve(pointSetUpdater.getProperty("outputPointSet").getValue(), 0, 0.5);
			curveDrawer.getProperty("curve").setAlwaysUpdateFlow();
			curveDrawer.setPropertyInput("curve", pointSetUpdater.getProperty("outputPointSet"));
			
			var canvasLayer = canvasView.getController().getLayer(aName+"/bottom");
			canvasLayer.setStrokeStyle(32, pantsColor, LineCapTypes.BUTT, LineJoinTypes.MITER);
			var curveDrawer = canvasLayer.drawCurve(pointSetUpdater.getProperty("outputPointSet").getValue(), 0.5, 2);
			curveDrawer.getProperty("curve").setAlwaysUpdateFlow();
			curveDrawer.setPropertyInput("curve", pointSetUpdater.getProperty("outputPointSet"));
		};
		
		var createGuitar = function(aName, aBaseX, aBaseY, aRotation) {
			var basePoint = movablePointsController.createPoint(aName + "/base", aBaseX, aBaseY);
			
			var pointSet = PointSet.createWithValues([
				0, 90,
				50, 45,
				30, 0,
				40, -60,
				0, -80,
				-40, -60,
				-30, 0,
				-50, 45
			], 2);
			var curve = BezierCurve.createWithLength(3, true, 28);
			
			dbm.singletons.dbmCurveEvaluator.createMultiSegmentBezierCurveFromPoints2d(pointSet.pointsArray, curve, true);
			
			var canvasLayer = canvasView.getController().getLayer(aName);
			canvasLayer.setPropertyInput("x", basePoint.getProperty("x"));
			canvasLayer.setPropertyInput("y", basePoint.getProperty("y"));
			canvasLayer.setPropertyInput("rotate", aRotation);
			
			var baseLayer = canvasView.getController().getLayer(aName+"/base");
			baseLayer.setFillStyle(guitarColor);
			baseLayer.drawCurve(curve);
			
			for(var i = 0; i < 5; i++) {
				var stringLayer = canvasView.getController().getLayer(aName+"/string/"+i);
				stringLayer.setStrokeStyle(0, "#000000");
				var xPosition = 5*(2-i);
				stringLayer.moveTo(xPosition, 30).lineTo(xPosition, -250);
			}
		};
		
		var upperArmLength = 100;
		var lowerArmLength = 100;
		
		createArm("arms/right", centerPositionX+50, centerPositionY-42, centerPositionX+155, centerPositionY-95, upperArmLength, lowerArmLength, 1);
		createArm("arms/left", centerPositionX-50, centerPositionY-42, centerPositionX-20, centerPositionY+20, upperArmLength, lowerArmLength, 1);
		
		var legLength = 70;
		createLeg("legs/right", centerPositionX+50-16, centerPositionY+50, centerPositionX+50-16, centerPositionY+50+2*legLength, legLength, legLength, -1);
		createLeg("legs/left", centerPositionX-50+16, centerPositionY+50, centerPositionX-50+16, centerPositionY+50+2*legLength, legLength, legLength, 1);
		
		createGuitar("guitar", centerPositionX-20, centerPositionY+20, 1.33*0.25*Math.PI);
		
	});
});