/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.projects.experiments.splineselection.SplineSelectionPlayer", "dbm.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.projects.experiments.splineselection.SplineSelectionPlayer");
	//"use strict";
	
	var SplineSelectionPlayer = dbm.importClass("dbm.projects.experiments.splineselection.SplineSelectionPlayer");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	var OneTouchOrMouseDetector = dbm.importClass("dbm.gui.abstract.touch.OneTouchOrMouseDetector");
	
	var PointSet = dbm.importClass("dbm.core.data.points.PointSet");
	var BezierCurve = dbm.importClass("dbm.core.data.curves.BezierCurve");
	
	var CallFunctionCommand = dbm.importClass("dbm.core.extendedevent.commands.basic.CallFunctionCommand");
	var TouchExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.TouchExtendedEventIds");
	
	var RepeatedRangeNode = dbm.importClass("dbm.flow.nodes.math.range.RepeatedRangeNode");
	var AdditionNode = dbm.importClass("dbm.flow.nodes.math.AdditionNode");
	var TransformElement3dNode = dbm.importClass("dbm.flow.nodes.display.TransformElement3dNode");
	var GetPointOnCurveNode = dbm.importClass("dbm.flow.nodes.curves.GetPointOnCurveNode");
	var GetTangentOnCurveNode = dbm.importClass("dbm.flow.nodes.curves.GetTangentOnCurveNode");
	var Atan2Node = dbm.importClass("dbm.flow.nodes.math.trigonometry.Atan2Node");
	var MultiplicationNode = dbm.importClass("dbm.flow.nodes.math.MultiplicationNode");
	var RangeNode = dbm.importClass("dbm.flow.nodes.math.range.RangeNode");
	var RoundNode = dbm.importClass("dbm.flow.nodes.math.round.RoundNode");
	
	objectFunctions._init = function() {
		console.log("dbm.projects.experiments.splineselection.SplineSelectionPlayer::_init");
		
		//METODO: this needs to be updated to set perspective
		
		this.superCall();
		
		this.setElementAsPositioned();
		
		this._touchDetector = OneTouchOrMouseDetector.create(dbm.getDocument().body);
		this._startPosition = 0;
		this._startEnvelope = 0;
		
		var touchData = this._touchDetector.getSelectionPoint();
		
		touchData.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.START, CallFunctionCommand.createCommand(this, this._callback_startTouch, []));
		touchData.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.END, CallFunctionCommand.createCommand(this, this._callback_stopTouch, []));
		touchData.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.MOVE, CallFunctionCommand.createCommand(this, this._callback_updateTouch, []));
		touchData.getExtendedEvent().addCommandToEvent(TouchExtendedEventIds.CANCEL, CallFunctionCommand.createCommand(this, this._callback_stopTouch, []));
		
		
		this._envelope = this.createProperty("envelope", 0);
		this._position = this.createProperty("position", 0);
		
		
		var definitionPoints = PointSet.createWithValues([250,-300,-100,-150,100,150,-250,300], 2);
		this._positionCurve = BezierCurve.createWithLength(3, true, 10);
		dbm.singletons.dbmCurveEvaluator.createMultiSegmentBezierCurveFromPoints2d(definitionPoints.pointsArray, this._positionCurve, false);
		console.log(definitionPoints, this._positionCurve);
		
		return this;
	};
	
	objectFunctions.addCard = function(aCard, aOffset) {
		
		this.getElement().appendChild(aCard.getElement());
		
		var offsetNode = AdditionNode.create(this._position, aOffset);
		
		var repeatedRangeNode = RepeatedRangeNode.create(offsetNode.getProperty("outputValue"), 0, 3);
		var zPositionNode = RangeNode.create(repeatedRangeNode.getProperty("outputValue"), 0, 3, -1400, 1400);
		var zIndexNode = RangeNode.create(repeatedRangeNode.getProperty("outputValue"), 0, 3, 1, 60);
		var zIndexRoundNode = RoundNode.create(zIndexNode.getProperty("outputValue"));
		
		var positionNode = GetPointOnCurveNode.create(this._positionCurve, repeatedRangeNode.getProperty("outputValue"));
		var tangentNode = GetTangentOnCurveNode.create(this._positionCurve, repeatedRangeNode.getProperty("outputValue"));
		
		var rotationNode = Atan2Node.create(tangentNode.getProperty("outputValueY"), tangentNode.getProperty("outputValueX"));
		
		var newTransformElement3dNode = TransformElement3dNode.create(aCard.getElement());
		newTransformElement3dNode.setPropertyInput("x", positionNode.getProperty("outputValueX"));
		newTransformElement3dNode.setPropertyInput("y", positionNode.getProperty("outputValueY"));
		newTransformElement3dNode.setPropertyInput("z", zPositionNode.getProperty("outputValue"));
		newTransformElement3dNode.setPropertyInput("rotateY", rotationNode.getProperty("outputValue"));
		newTransformElement3dNode.getProperty("display").startUpdating();
		
		aCard.setPropertyInput("zIndex", zIndexRoundNode.getProperty("outputValue"));
		aCard.getProperty("zIndex").startUpdating();
	};
	
	objectFunctions._callback_startTouch = function() {
		console.log("dbm.projects.experiments.splineselection.SplineSelectionPlayer::_callback_startTouch");
		
		this._startPosition = this._position.getValue();
		this._startEnvelope = this._envelope.getValue();
	};
	
	objectFunctions._callback_updateTouch = function() {
		console.log("dbm.projects.experiments.splineselection.SplineSelectionPlayer::_callback_updateTouch");
		
		var touchData = this._touchDetector.getSelectionPoint();
		
		this._position.setValue(this._startPosition+0.002*(touchData.getProperty("currentY").getValue()-touchData.getProperty("startY").getValue()));
		//this._envelope.setValue(Math.max(0, Math.min(1, this._startEnvelope+)));
	};
	
	objectFunctions._callback_stopTouch = function() {
		console.log("dbm.projects.experiments.splineselection.SplineSelectionPlayer::_callback_stopTouch");
		
		this._callback_updateTouch()
	};
	
	objectFunctions.start = function() {
		console.log("dbm.projects.experiments.splineselection.SplineSelectionPlayer::start");
		
		this._touchDetector.activate();
		this.getProperty("display").startUpdating();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._touchDetector = null;
		this._envelope = null;
		this._position = null;
		this._positionCurve = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		//console.log("dbm.projects.experiments.splineselection.SplineSelectionPlayer::create");
		//console.log(aElement);
		
		var newSplineSelectionPlayer = (new ClassReference()).init();
		return newSplineSelectionPlayer;
	};
});