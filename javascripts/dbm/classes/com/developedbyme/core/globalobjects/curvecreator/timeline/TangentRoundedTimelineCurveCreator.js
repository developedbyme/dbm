/**
 * Timeline curve creator that constructs the curve by evaluating the tangent an creates a curve that goes through each of those points.
 *
 * @authur	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.0.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.curvecreator.timeline.TangentRoundedTimelineCurveCreator", "com.developedbyme.core.globalobjects.curvecreator.timeline.TimelineCurveCreatorBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.curvecreator.timeline.TangentRoundedTimelineCurveCreator");
	//"use strict";
	
	//Self reference
	var TangentRoundedTimelineCurveCreator = dbm.importClass("com.developedbyme.core.globalobjects.curvecreator.timeline.TangentRoundedTimelineCurveCreator");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	var LineIntersection2d = dbm.importClass("com.developedbyme.utils.math.LineIntersection2d");
	
	//Utilities
	var VectorFunctions = dbm.importClass("com.developedbyme.utils.math.VectorFunctions");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.curvecreator.timeline.TangentRoundedTimelineCurveCreator");
		
		this.superCall();
		this.numberOfSteps = 1;
		this._tempStartPoint = Point.create();
		this._tempEndPoint = Point.create();
		this._tempStartVector = Point.create();
		this._tempEndVector = Point.create();
		this._tempDistanceVector = Point.create();
		
		return this;
	};
	
	/**
	 * Creates a curve from a timeline part.
	 */
	objectFunctions.createCurveFromPart = function(aTimelinePart, aStartTime, aEndTime, aDefaultNumberOfSteps, aXOffset, aReturnCurve, aPositionOnCurve) {
		console.log("com.developedbyme.core.globalobjects.curvecreator.timeline.TangentRoundedTimelineCurveCreator::createCurveFromPart");
		
		var numberOfSteps = this.numberOfSteps;
		
		var currentPosition = aPositionOnCurve;
		
		var timelinePartStartTime = aTimelinePart.startTime;
		var timelinePartDuration = (aTimelinePart.endTime-timelinePartStartTime);
		var requestedDuration = (aEndTime-aStartTime);
		
		var startXPosition = aStartTime+aXOffset;
		var startYPosition = aTimelinePart.getValueByParameter(0);
		var startTangent = aTimelinePart.getTangentByParameter(0);
		
		dbm.singletons.dbmCurveCreator.ensureNextSegments(aReturnCurve, aPositionOnCurve, numberOfSteps);
		var lastPoint = aReturnCurve.pointsArray[currentPosition];
		var lastX = lastPoint.x;
		var lastY = lastPoint.y;
		if(startXPosition !== lastX || startYPosition !== lastY) {
			dbm.singletons.dbmCurveCreator.ensureNextSegments(aReturnCurve, aPositionOnCurve, numberOfSteps+1);
			dbm.singletons.dbmCurveCreator.setEndOfLinearSegment(lastX, lastY, startXPosition, startYPosition, aReturnCurve, currentPosition);
			currentPosition += 3;
		}
		
		
		for(var i = 1; i <= numberOfSteps; i++) { //MENOTE: include last step
			var parameter = i/(numberOfSteps);
			var currentTime = parameter*requestedDuration+aStartTime;
			
			var endXPosition = currentTime+aXOffset;
			var endYPosition = aTimelinePart.getValueAt(currentTime);
			var endTangent = aTimelinePart.getTangentAt(currentTime);
			
			this._tempStartVector.x = 1;
			this._tempStartVector.y = startTangent;
			
			
			this._tempEndVector.x = -1;
			this._tempEndVector.y = -1*endTangent;
			
			this._tempStartPoint.x = startXPosition;
			this._tempStartPoint.y = startYPosition;
			
			this._tempEndPoint.x = endXPosition;
			this._tempEndPoint.y = endYPosition;
			
			var tempLineIntersection = LineIntersection2d.getTempLineIntersection();
			var hasIntersection = tempLineIntersection.findLineIntersection(this._tempStartPoint, this._tempStartVector, this._tempEndPoint, this._tempEndVector);
			
			hasIntersection = (hasIntersection && (tempLineIntersection.parameter1 >= 0) && (tempLineIntersection.parameter2 >= 0));
			
			if(hasIntersection) {
				var currentPoint = aReturnCurve.pointsArray[currentPosition+1];
				currentPoint.x = startXPosition+(2/3)*tempLineIntersection.parameter1*this._tempStartVector.x;
				currentPoint.y = startYPosition+(2/3)*tempLineIntersection.parameter1*this._tempStartVector.y;
			
				var currentPoint = aReturnCurve.pointsArray[currentPosition+2];
				currentPoint.x = endXPosition+(2/3)*tempLineIntersection.parameter2*this._tempEndVector.x;
				currentPoint.y = endYPosition+(2/3)*tempLineIntersection.parameter2*this._tempEndVector.y;
			}
			else {
				
				//METODO: error message
				
				VectorFunctions.normalizeSelf2d(this._tempStartVector);
				VectorFunctions.normalizeSelf2d(this._tempEndVector);
				var distanceX = endXPosition-startXPosition;
				var distanceY = endYPosition-startYPosition;
				this._tempDistanceVector.x = distanceX;
				this._tempDistanceVector.y = distanceY;
				var distanceLength = Point.getLengthOfVectorValues2d(distanceX, distanceY);
				VectorFunctions.normalizeSelf2d(this._tempDistanceVector);
				
				var startDotProduct = VectorFunctions.dotProduct2d(this._tempStartVector, this._tempDistanceVector);
				var endDotProduct = VectorFunctions.dotProduct2d(this._tempEndVector, this._tempDistanceVector);
			
				var currentPoint = aReturnCurve.pointsArray[currentPosition+1];
				currentPoint.x = startXPosition+(1/3)*distanceLength*startDotProduct*this._tempStartVector.x;
				currentPoint.y = startYPosition+(1/3)*distanceLength*startDotProduct*this._tempStartVector.y;
			
				var currentPoint = aReturnCurve.pointsArray[currentPosition+2];
				currentPoint.x = endXPosition-(1/3)*distanceLength*endDotProduct*this._tempEndVector.x;
				currentPoint.y = endYPosition-(1/3)*distanceLength*endDotProduct*this._tempEndVector.y;
			}
			
			var currentPoint = aReturnCurve.pointsArray[currentPosition+3];
			currentPoint.x = endXPosition;
			currentPoint.y = endYPosition;
			
			currentPosition += 3;
			startXPosition = endXPosition;
			startYPosition = endYPosition;
			startTangent = endTangent;
		}
		
		return currentPosition;
	};
	
	staticFunctions.create = function(aNumberOfSteps) {
		var newTangentRoundedTimelineCurveCreator = (new ClassReference()).init();
		newTangentRoundedTimelineCurveCreator.numberOfSteps = aNumberOfSteps;
		return newTangentRoundedTimelineCurveCreator;
	};
});