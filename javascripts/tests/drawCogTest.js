dbm.runTempFunction(function() {
	
	var CanvasView = dbm.importClass("dbm.gui.canvas.CanvasView");
	var BaseButton = dbm.importClass("dbm.gui.buttons.BaseButton");
	var ButtonExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ButtonExtendedEventIds");
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var MultiplicationNode = dbm.importClass("dbm.flow.nodes.math.MultiplicationNode");
	var SimpleSpeedNode = dbm.importClass("dbm.flow.nodes.incrementation.SimpleSpeedNode");
	var DrawPatternNode = dbm.importClass("dbm.flow.nodes.canvas.DrawPatternNode");
	var CreatePatternNode = dbm.importClass("dbm.flow.nodes.canvas.CreatePatternNode");
	
	var LoadingExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.LoadingExtendedEventIds");
	var InterpolationTypes = dbm.importClass("dbm.constants.InterpolationTypes");
	
	dbm.addStartFunction(function() {
		console.log("startFunction");
		
		var startFunction = function() {
			var newCurve = dbm.singletons.dbmCurveCreator.createStar(19, [70, 70, 60, 60], 0);
			
			//console.log(newCurve);
			
			var rollOverButton = BaseButton.createDiv(document, true);
			
			var canvasView = CanvasView.create(rollOverButton.getElement(), true, "2d");
			var canvasController = canvasView.getController();
			canvasController._numberOfLinksToResolve = 30;
			
			canvasController.getRootLayer().getProperty("x").setValue(100);
			canvasController.getRootLayer().getProperty("y").setValue(75);
			
			var mask = dbm.singletons.dbmCurveCreator.createCircle(50, 0, 50);
			
			var mainLayer = canvasController.getLayer("main");
			
			var drawLayer = canvasController.getLayer("main/linked/cog");
			drawLayer.setStrokeStyle(1, "#FF0000");
			drawLayer.setFillStyle("#FF0000");
			drawLayer.drawCurve(newCurve);
			drawLayer.closePath();
			
			var blurLayer = canvasController.getLayer("main/linked/blur");
			blurLayer.getProperty("rotate").setValue(-0.02);
			
			canvasController.createLink("/main/linked/blur/link", "/main/linked");
			
			var rotationTimeline = dbm.singletons.dbmAnimationManager.createTimeline(0, null);
			var speedNode = SimpleSpeedNode.create(dbm.singletons.dbmAnimationManager.getGlobalTimeNode().getProperty("time"), 0, rotationTimeline.getProperty("outputValue"));
			var multiplierNode = MultiplicationNode.create(speedNode.getProperty("outputValue"), 2*Math.PI);
			var blurNode = MultiplicationNode.create(rotationTimeline.getProperty("outputValue"), 0.7);
			
			drawLayer.setPropertyInput("rotate", multiplierNode.getProperty("outputValue"));
			blurLayer.setPropertyInput("alpha", blurNode.getProperty("outputValue"));
			
			//canvasController.debugTraceStructure();
			
			var mask = dbm.singletons.dbmCurveCreator.createCircle(0, 0, 50);
			
			var maskLayer = canvasController.getLayer("main/lines");
			maskLayer.maskCurve(mask);
			maskLayer.setMaskUsage(true);
			
			var linesLayer = canvasController.getLayer("main/lines/linked/lines");
			
			var linesBlurLayer = canvasController.getLayer("main/lines/linked/blur");
			linesBlurLayer.getProperty("x").setValue(3);
			linesBlurLayer.setPropertyInput("alpha", blurNode.getProperty("outputValue"));
			
			canvasController.createLink("/main/lines/linked/blur/link", "/main/lines/linked");
			
			var patternImage = dbm.singletons.dbmAssetRepository.getAssetData("images/stripePattern.jpg");
			
			var linesSpeedNode = SimpleSpeedNode.create(dbm.singletons.dbmAnimationManager.getGlobalTimeNode().getProperty("time"), 0, rotationTimeline.getProperty("outputValue"));
			var linesMultiplierNode = MultiplicationNode.create(linesSpeedNode.getProperty("outputValue"), -300);
			
			var drawPatternNode = DrawPatternNode.create(patternImage, patternImage.width, patternImage.height, linesMultiplierNode.getProperty("outputValue"));
			var createPatternNode = CreatePatternNode.create(drawPatternNode.getProperty("canvas"));
			
			linesLayer._getCurrentDrawingLayer().getProperty("fillStyle").connectInput(createPatternNode.getProperty("pattern"));
			linesLayer.drawCurve(dbm.singletons.dbmCurveCreator.createRectangle(-50, -50, 100, 100));
			
			canvasController.getProperty("display").startUpdating();
			
			rollOverButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.MOUSE_OVER, CallFunctionCommand.createCommand(rotationTimeline, rotationTimeline.animateValue, [1, 2, InterpolationTypes.QUADRATIC]));
			rollOverButton.getExtendedEvent().addCommandToEvent(ButtonExtendedEventIds.MOUSE_OUT, CallFunctionCommand.createCommand(rotationTimeline, rotationTimeline.animateValue, [0, 1.5, InterpolationTypes.INVERTED_QUADRATIC]));
			rollOverButton.activate();
		}
		
		var patternImageAsset = dbm.singletons.dbmAssetRepository.getAsset("images/stripePattern.jpg");
		patternImageAsset.getExtendedEvent().addCommandToEvent(LoadingExtendedEventIds.LOADED, CallFunctionCommand.createCommand(this, startFunction, []));
		patternImageAsset.load();
	});
});