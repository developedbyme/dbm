dbm.runTempFunction(function() {
	
	var CanvasView = dbm.importClass("com.developedbyme.gui.canvas.CanvasView");
	var BaseButton = dbm.importClass("com.developedbyme.gui.buttons.BaseButton");
	var ButtonExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.ButtonExtendedEventIds");
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var MultiplicationNode = dbm.importClass("com.developedbyme.flow.nodes.math.MultiplicationNode");
	var SimpleSpeedNode = dbm.importClass("com.developedbyme.flow.nodes.incrementation.SimpleSpeedNode");
	var InterpolationTypes = dbm.importClass("com.developedbyme.constants.InterpolationTypes");
	
	var startFunction = function() {
		console.log("startFunction");
		
		var horizontalLines = new Array();
		var verticalLines = new Array();
		
		var newCurve = dbm.singletons.dbmCurveCreator.createGrid(0, 0, 1200, 600, 20, 10, horizontalLines, verticalLines);
		
		//console.log(newCurve);
		
		var rollOverButton = BaseButton.createDiv(document, true);
		
		var canvasView = CanvasView.create(rollOverButton.getElement(), true, "2d", {"width": 1000, "height": 580, "style": "border: 1px solid #000000"});
		var canvasController = canvasView.getController();
		canvasController._numberOfLinksToResolve = 30;
		
		var drawLayer = canvasController.getLayer("main/linked/grid");
		drawLayer.getProperty("x").setValue(100);
		drawLayer.getProperty("y").setValue(-75);
		drawLayer.getProperty("rotate").setValue(0.1*Math.PI);
		drawLayer.setStrokeStyle(1, "#EEEEEE");
		
		var curveDrawer = drawLayer.drawCurve(horizontalLines[0]);
		drawLayer.stopWorkingOnCurrentPath();
		curveDrawer.getProperty("endParameter").setValue(0);
		curveDrawer.getProperty("endParameter").animateValue(horizontalLines[0].getMaxParameter(), 0.5, InterpolationTypes.INVERTED_QUADRIC, 0);
		
		for(var i = 1; i < horizontalLines.length-1; i++) {
			var curveDrawer = drawLayer.drawCurve(horizontalLines[i]);
			drawLayer.stopWorkingOnCurrentPath();
			var randomStartPoint = Math.random()*horizontalLines[i].getMaxParameter();
			var randomDelay = 0.4*Math.random()+0.2;
			curveDrawer.getProperty("startParameter").setValue(randomStartPoint);
			curveDrawer.getProperty("startParameter").animateValue(0, 0.4, InterpolationTypes.INVERTED_QUADRIC, randomDelay);
			curveDrawer.getProperty("endParameter").setValue(randomStartPoint);
			curveDrawer.getProperty("endParameter").animateValue(horizontalLines[i].getMaxParameter(), 0.4, InterpolationTypes.INVERTED_QUADRIC, randomDelay);
		}
		
		var curveDrawer = drawLayer.drawCurve(horizontalLines[horizontalLines.length-1]);
		drawLayer.stopWorkingOnCurrentPath();
		curveDrawer.getProperty("startParameter").setValue(horizontalLines[horizontalLines.length-1].getMaxParameter());
		curveDrawer.getProperty("startParameter").animateValue(0, 0.5, InterpolationTypes.INVERTED_QUADRIC, 0);
		
		
		
		var curveDrawer = drawLayer.drawCurve(verticalLines[0]);
		drawLayer.stopWorkingOnCurrentPath();
		curveDrawer.getProperty("endParameter").setValue(0);
		curveDrawer.getProperty("endParameter").animateValue(verticalLines[0].getMaxParameter(), 0.5, InterpolationTypes.INVERTED_QUADRIC, 0);
		
		for(var i = 1; i < verticalLines.length-1; i++) {
			var curveDrawer = drawLayer.drawCurve(verticalLines[i]);
			drawLayer.stopWorkingOnCurrentPath();
			var randomStartPoint = Math.random()*verticalLines[i].getMaxParameter();
			var randomDelay = 0.4*Math.random()+0.2;
			curveDrawer.getProperty("startParameter").setValue(randomStartPoint);
			curveDrawer.getProperty("startParameter").animateValue(0, 0.4, InterpolationTypes.INVERTED_QUADRIC, randomDelay);
			curveDrawer.getProperty("endParameter").setValue(randomStartPoint);
			curveDrawer.getProperty("endParameter").animateValue(verticalLines[i].getMaxParameter(), 0.4, InterpolationTypes.INVERTED_QUADRIC, randomDelay);
		}
		
		var curveDrawer = drawLayer.drawCurve(verticalLines[verticalLines.length-1]);
		drawLayer.stopWorkingOnCurrentPath();
		curveDrawer.getProperty("startParameter").setValue(verticalLines[verticalLines.length-1].getMaxParameter());
		curveDrawer.getProperty("startParameter").animateValue(0, 0.5, InterpolationTypes.INVERTED_QUADRIC, 0);
		
		var drawLayer = canvasController.getLayer("main/linked/lines");
		drawLayer.setStrokeStyle(1, "#CCCCCC");
		
		var currentLine = dbm.singletons.dbmCurveCreator.createCurveFromDoubleSeparatedString(1, true, "150, 0; 100, 580");
		var curveDrawer = drawLayer.drawCurve(currentLine);
		drawLayer.stopWorkingOnCurrentPath();
		curveDrawer.getProperty("endParameter").setValue(0);
		curveDrawer.getProperty("endParameter").animateValue(currentLine.getMaxParameter(), 0.8, InterpolationTypes.INVERTED_QUADRIC, 0.3);
		
		var currentLine = dbm.singletons.dbmCurveCreator.createCurveFromDoubleSeparatedString(1, true, "400, 0; 600, 580");
		var curveDrawer = drawLayer.drawCurve(currentLine);
		drawLayer.stopWorkingOnCurrentPath();
		curveDrawer.getProperty("startParameter").setValue(currentLine.getMaxParameter());
		curveDrawer.getProperty("startParameter").animateValue(0, 0.5, InterpolationTypes.INVERTED_QUADRIC, 0.7);
		
		var currentLine = dbm.singletons.dbmCurveCreator.createCurveFromDoubleSeparatedString(1, true, "300, 580; 1000, 300");
		var curveDrawer = drawLayer.drawCurve(currentLine);
		drawLayer.stopWorkingOnCurrentPath();
		curveDrawer.getProperty("endParameter").setValue(0);
		curveDrawer.getProperty("endParameter").animateValue(currentLine.getMaxParameter(), 0.6, InterpolationTypes.INVERTED_QUADRIC, 0.1);
		
		//var rotationTimeline = dbm.singletons.dbmAnimationManager.createTimeline(0, null);
		//var speedNode = SimpleSpeedNode.create(dbm.singletons.dbmAnimationManager.getGlobalTimeNode().getProperty("time"), 0, rotationTimeline.getProperty("outputValue"));
		//var multiplierNode = MultiplicationNode.create(speedNode.getProperty("outputValue"), 2*Math.PI);
		//var blurNode = MultiplicationNode.create(rotationTimeline.getProperty("outputValue"), 0.7);
		
		//drawLayer.setPropertyInput("rotate", multiplierNode.getProperty("outputValue"));
		//blurLayer.setPropertyInput("alpha", blurNode.getProperty("outputValue"));
		
		//canvasController.debugTraceStructure();
		
		canvasController.getProperty("display").startUpdating();
		
		//rollOverButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.MOUSE_OVER, CallFunctionCommand.createCommand(rotationTimeline, rotationTimeline.animateValue, [1, 2, InterpolationTypes.QUADRIC]));
		//rollOverButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.MOUSE_OUT, CallFunctionCommand.createCommand(rotationTimeline, rotationTimeline.animateValue, [0, 1.5, InterpolationTypes.INVERTED_QUADRIC]));
		//rollOverButton.activate();
	};
	
	dbm.addStartFunction(startFunction);
});