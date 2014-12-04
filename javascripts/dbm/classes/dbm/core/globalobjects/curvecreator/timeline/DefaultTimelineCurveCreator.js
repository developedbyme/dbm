/**
 * Default timeline curve creator that constructs the curve by evaluating every step with the default length.
 *
 * @authur	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.0.01
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.curvecreator.timeline.DefaultTimelineCurveCreator", "dbm.core.globalobjects.curvecreator.timeline.TimelineCurveCreatorBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.curvecreator.timeline.DefaultTimelineCurveCreator");
	//"use strict";
	
	//Self reference
	var DefaultTimelineCurveCreator = dbm.importClass("dbm.core.globalobjects.curvecreator.timeline.DefaultTimelineCurveCreator");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.ReportLevelTypes");
	
	//Dependencies
	
	//Utilities
	
	//Constants
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.curvecreator.timeline.DefaultTimelineCurveCreator");
		
		this.superCall();
		
		return this;
	};
	
	/**
	 * Creates a curve from a timeline part.
	 */
	objectFunctions.createCurveFromPart = function(aTimelinePart, aStartTime, aEndTime, aDefaultNumberOfSteps, aXOffset, aReturnCurve, aPositionOnCurve) {
		
		var currentPosition = aPositionOnCurve;
		
		var timelinePartStartTime = aTimelinePart.startTime;
		var timelinePartDuration = (aTimelinePart.endTime-timelinePartStartTime);
		var requestedDuration = (aEndTime-aStartTime);
		
		var startXPosition = aStartTime+aXOffset;
		var startYPosition = aTimelinePart.getValueByParameter(0);
		
		dbm.singletons.dbmCurveCreator.ensureNextSegments(aReturnCurve, aPositionOnCurve, aDefaultNumberOfSteps-1);
		var lastPoint = aReturnCurve.pointsArray[currentPosition];
		var lastX = lastPoint.x;
		var lastY = lastPoint.y;
		if(startXPosition !== lastX || startYPosition !== lastY) {
			dbm.singletons.dbmCurveCreator.ensureNextSegments(aReturnCurve, aPositionOnCurve, aDefaultNumberOfSteps);
			dbm.singletons.dbmCurveCreator.setEndOfLinearSegment(lastX, lastY, startXPosition, startYPosition, aReturnCurve, currentPosition);
			currentPosition += 3;
		}
		
		for(var i = 1; i < aDefaultNumberOfSteps; i++) {
			var parameter = i/(aDefaultNumberOfSteps-1);
			var currentTime = parameter*requestedDuration+aStartTime;
			
			var endXPosition = currentTime+aXOffset;
			var endYPosition = aTimelinePart.getValueAt(currentTime);
			
			dbm.singletons.dbmCurveCreator.setEndOfLinearSegment(startXPosition, startYPosition, endXPosition, endYPosition, aReturnCurve, currentPosition);
			
			currentPosition += 3;
			startXPosition = endXPosition;
			startYPosition = endYPosition;
		}
		
		return currentPosition;
	};
	
	staticFunctions.create = function() {
		var newDefaultTimelineCurveCreator = (new ClassReference()).init();
		return newDefaultTimelineCurveCreator;
	};
});