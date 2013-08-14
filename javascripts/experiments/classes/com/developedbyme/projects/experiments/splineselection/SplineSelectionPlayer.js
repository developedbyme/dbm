dbm.registerClass("com.developedbyme.projects.experiments.splineselection.SplineSelectionPlayer", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.projects.experiments.splineselection.SplineSelectionPlayer");
	//"use strict";
	
	var SplineSelectionPlayer = dbm.importClass("com.developedbyme.projects.experiments.splineselection.SplineSelectionPlayer");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var OneTouchOrMouseDetector = dbm.importClass("com.developedbyme.gui.abstract.touch.OneTouchOrMouseDetector");
	
	var PointSet = dbm.importClass("com.developedbyme.core.data.points.PointSet");
	var BezierCurve = dbm.importClass("com.developedbyme.core.data.curves.BezierCurve");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var TouchExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.TouchExtendedEventIds");
	
	var RepeadedRange = dbm.importClass("com.developedbyme.flow.nodes.math.range.RepeatedRangeNode");
	var AdditionNode = dbm.importClass("com.developedbyme.flow.nodes.math.AdditionNode");
	var TransformElement3dNode = dbm.importClass("com.developedbyme.flow.nodes.display.TransformElement3dNode");
	var GetPointOnCurveNode = dbm.importClass("com.developedbyme.flow.nodes.curves.GetPointOnCurveNode");
	var GetTangentOnCurveNode = dbm.importClass("com.developedbyme.flow.nodes.curves.GetTangentOnCurveNode");
	var Atan2Node = dbm.importClass("com.developedbyme.flow.nodes.math.trigonometry.Atan2Node");
	var MultiplicationNode = dbm.importClass("com.developedbyme.flow.nodes.math.MultiplicationNode");
	var RangeNode = dbm.importClass("com.developedbyme.flow.nodes.math.range.RangeNode");
	var RoundNode = dbm.importClass("com.developedbyme.flow.nodes.math.round.RoundNode");
	
	objectFunctions._init = function() {
		console.log("com.developedbyme.projects.experiments.splineselection.SplineSelectionPlayer::_init");
		
		this.superCall();
		
		this.setElementAsTransformed();
		
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
		
		var repeatedRangeNode = RepeadedRange.create(offsetNode.getProperty("outputValue"), 0, 3);
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
		console.log("com.developedbyme.projects.experiments.splineselection.SplineSelectionPlayer::_callback_startTouch");
		
		this._startPosition = this._position.getValue();
		this._startEnvelope = this._envelope.getValue();
	};
	
	objectFunctions._callback_updateTouch = function() {
		console.log("com.developedbyme.projects.experiments.splineselection.SplineSelectionPlayer::_callback_updateTouch");
		
		var touchData = this._touchDetector.getSelectionPoint();
		
		this._position.setValue(this._startPosition+0.002*(touchData.getProperty("currentY").getValue()-touchData.getProperty("startY").getValue()));
		//this._envelope.setValue(Math.max(0, Math.min(1, this._startEnvelope+)));
	};
	
	objectFunctions._callback_stopTouch = function() {
		console.log("com.developedbyme.projects.experiments.splineselection.SplineSelectionPlayer::_callback_stopTouch");
		
		this._callback_updateTouch()
	};
	
	objectFunctions.start = function() {
		console.log("com.developedbyme.projects.experiments.splineselection.SplineSelectionPlayer::start");
		
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
		//console.log("com.developedbyme.projects.experiments.splineselection.SplineSelectionPlayer::create");
		//console.log(aElement);
		
		var newSplineSelectionPlayer = (new ClassReference()).init();
		return newSplineSelectionPlayer;
	};
});