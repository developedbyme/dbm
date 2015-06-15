/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("Application", "dbm.gui.abstract.startup.standalone.StandAlonePage", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("Application");
	//"use strict";
	
	//Self reference
	var Application = dbm.importClass("Application");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var CanvasView = dbm.importClass("dbm.gui.canvas.CanvasView");
	var BaseButton = dbm.importClass("dbm.gui.buttons.BaseButton");
	var MultiplicationNode = dbm.importClass("dbm.flow.nodes.math.MultiplicationNode");
	var SimpleSpeedNode = dbm.importClass("dbm.flow.nodes.incrementation.SimpleSpeedNode");
	var DrawPatternNode = dbm.importClass("dbm.flow.nodes.canvas.DrawPatternNode");
	var CreatePatternNode = dbm.importClass("dbm.flow.nodes.canvas.CreatePatternNode");
	var EvaluateTimelineNode = dbm.importClass("dbm.flow.nodes.animation.EvaluateTimelineNode");
	
	//Utils
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	
	//Constants
	var InterpolationTypes = dbm.importClass("dbm.constants.generic.InterpolationTypes");
	var LineJoinTypes = dbm.importClass("dbm.constants.graphics.LineJoinTypes");
	var ButtonExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ButtonExtendedEventIds");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		console.log("Application::_init");
		
		this.superCall();
		
		this._patternFilePath = "assets/images/stripePattern.jpg";
		
		this._assetsLoader.addAssetByPath(this._patternFilePath);
		this._addStartFunction(this._createPage, []);
		
		return this;
	};
	
	objectFunctions._createPage = function() {
		console.log("Application::_createPage");
		
		var horizontalLines = new Array();
		var verticalLines = new Array();
		
		var newCurve = dbm.singletons.dbmCurveCreator.createGrid(0, 0, 1200, 600, 20, 10, horizontalLines, verticalLines);
		
		//console.log(newCurve);
		
		var rollOverButton = BaseButton.createDiv(this._contentHolder, true);
		
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
		curveDrawer.getProperty("endParameter").animateValue(horizontalLines[0].getMaxParameter(), 0.5, InterpolationTypes.INVERTED_QUADRATIC, 0);
		
		for(var i = 1; i < horizontalLines.length-1; i++) {
			var curveDrawer = drawLayer.drawCurve(horizontalLines[i]);
			drawLayer.stopWorkingOnCurrentPath();
			var randomStartPoint = Math.random()*horizontalLines[i].getMaxParameter();
			var randomDelay = 0.4*Math.random()+0.2;
			curveDrawer.getProperty("startParameter").setValue(randomStartPoint);
			curveDrawer.getProperty("startParameter").animateValue(0, 0.4, InterpolationTypes.INVERTED_QUADRATIC, randomDelay);
			curveDrawer.getProperty("endParameter").setValue(randomStartPoint);
			curveDrawer.getProperty("endParameter").animateValue(horizontalLines[i].getMaxParameter(), 0.4, InterpolationTypes.INVERTED_QUADRATIC, randomDelay);
		}
		
		var curveDrawer = drawLayer.drawCurve(horizontalLines[horizontalLines.length-1]);
		drawLayer.stopWorkingOnCurrentPath();
		curveDrawer.getProperty("startParameter").setValue(horizontalLines[horizontalLines.length-1].getMaxParameter());
		curveDrawer.getProperty("startParameter").animateValue(0, 0.5, InterpolationTypes.INVERTED_QUADRATIC, 0);
		
		
		
		var curveDrawer = drawLayer.drawCurve(verticalLines[0]);
		drawLayer.stopWorkingOnCurrentPath();
		curveDrawer.getProperty("endParameter").setValue(0);
		curveDrawer.getProperty("endParameter").animateValue(verticalLines[0].getMaxParameter(), 0.5, InterpolationTypes.INVERTED_QUADRATIC, 0);
		
		for(var i = 1; i < verticalLines.length-1; i++) {
			var curveDrawer = drawLayer.drawCurve(verticalLines[i]);
			drawLayer.stopWorkingOnCurrentPath();
			var randomStartPoint = Math.random()*verticalLines[i].getMaxParameter();
			var randomDelay = 0.4*Math.random()+0.2;
			curveDrawer.getProperty("startParameter").setValue(randomStartPoint);
			curveDrawer.getProperty("startParameter").animateValue(0, 0.4, InterpolationTypes.INVERTED_QUADRATIC, randomDelay);
			curveDrawer.getProperty("endParameter").setValue(randomStartPoint);
			curveDrawer.getProperty("endParameter").animateValue(verticalLines[i].getMaxParameter(), 0.4, InterpolationTypes.INVERTED_QUADRATIC, randomDelay);
		}
		
		var curveDrawer = drawLayer.drawCurve(verticalLines[verticalLines.length-1]);
		drawLayer.stopWorkingOnCurrentPath();
		curveDrawer.getProperty("startParameter").setValue(verticalLines[verticalLines.length-1].getMaxParameter());
		curveDrawer.getProperty("startParameter").animateValue(0, 0.5, InterpolationTypes.INVERTED_QUADRATIC, 0);
		
		var drawLayer = canvasController.getLayer("main/linked/lines");
		drawLayer.setStrokeStyle(1, "#CCCCCC");
		
		var currentLine = dbm.singletons.dbmCurveCreator.createCurveFromDoubleSeparatedString(1, true, "150, 0; 100, 580");
		var curveDrawer = drawLayer.drawCurve(currentLine);
		drawLayer.stopWorkingOnCurrentPath();
		curveDrawer.getProperty("endParameter").setValue(0);
		curveDrawer.getProperty("endParameter").animateValue(currentLine.getMaxParameter(), 0.8, InterpolationTypes.INVERTED_QUADRATIC, 0.3);
		
		var currentLine = dbm.singletons.dbmCurveCreator.createCurveFromDoubleSeparatedString(1, true, "400, 0; 600, 580");
		var curveDrawer = drawLayer.drawCurve(currentLine);
		drawLayer.stopWorkingOnCurrentPath();
		curveDrawer.getProperty("startParameter").setValue(currentLine.getMaxParameter());
		curveDrawer.getProperty("startParameter").animateValue(0, 0.5, InterpolationTypes.INVERTED_QUADRATIC, 0.7);
		
		var currentLine = dbm.singletons.dbmCurveCreator.createCurveFromDoubleSeparatedString(1, true, "300, 580; 1000, 300");
		var curveDrawer = drawLayer.drawCurve(currentLine);
		drawLayer.stopWorkingOnCurrentPath();
		curveDrawer.getProperty("endParameter").setValue(0);
		curveDrawer.getProperty("endParameter").animateValue(currentLine.getMaxParameter(), 0.6, InterpolationTypes.INVERTED_QUADRATIC, 0.1);
		
		var textHolderLayer = canvasController.getLayer("main/text");
		textHolderLayer.getProperty("x").setValue(100);
		textHolderLayer.getProperty("y").setValue(300);
		
		var patternImage = dbm.singletons.dbmAssetRepository.getAssetData(this._patternFilePath);
		
		var rotationTimeline = dbm.singletons.dbmAnimationManager.createTimeline(0, null);
		var rotationTimelineEvalutationNode = EvaluateTimelineNode.create(rotationTimeline, dbm.singletons.dbmAnimationManager.globalTimeProperty);
		rotationTimeline._internalFunctionality_setReferenceTime(rotationTimelineEvalutationNode.getProperty("inputValue"));
		
		var speedNode = SimpleSpeedNode.create(dbm.singletons.dbmAnimationManager.getGlobalTimeNode().getProperty("time"), 0, rotationTimelineEvalutationNode.getProperty("outputValue"));
		var multiplierNode = MultiplicationNode.create(speedNode.getProperty("outputValue"), 16);
		
		rotationTimeline.animateValue(1, 2, InterpolationTypes.INVERTED_QUADRATIC, 0);
		
		var drawPatternNode = DrawPatternNode.create(patternImage, patternImage.width, patternImage.height, multiplierNode.getProperty("outputValue"));
		var createPatternNode = CreatePatternNode.create(drawPatternNode.getProperty("canvas"));
		
		var textShadowLayer = canvasController.getLayer("main/text/shadow");
		var textShadowDrawer = textShadowLayer.drawText("EXPERIMENT");
		textShadowDrawer.getProperty("font").setValue("126px Arial");
		textShadowDrawer.getProperty("fillStyle").connectInput(createPatternNode.getProperty("pattern"));
		textShadowLayer.getProperty("x").setValue(0);
		textShadowLayer.getProperty("y").setValue(0);
		
		for(var i = 0; i < 15; i++) {
			var textShadowLayer = canvasController.getLayer("main/text/shadow"+i);
			textShadowLayer.getProperty("x").setValue(-1*i);
			textShadowLayer.getProperty("y").setValue(i);
			canvasController.createLink("/main/text/shadow"+i+"/link", "/main/text/shadow");
		}
		
		var textLayer = canvasController.getLayer("main/text/main");
		var textDrawer = textLayer.drawText("EXPERIMENT");
		textDrawer._strokeOverFill = false;
		textDrawer.getProperty("font").setValue("126px Arial");
		textDrawer.getProperty("fillStyle").setValue("#FF0000");
		textDrawer.getProperty("strokeStyle").setValue("#FFFFFF");
		textDrawer.getProperty("lineJoin").setValue(LineJoinTypes.ROUND);
		textDrawer.getProperty("lineWidth").setValue(7);
		
		canvasController.getProperty("display").startUpdating();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("Application::setAllReferencesToNull");
		
		this.superCall();
	};
});