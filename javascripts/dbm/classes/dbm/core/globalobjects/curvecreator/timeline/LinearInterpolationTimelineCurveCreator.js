/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Timeline curve creator that constructs the curve for a linear interpolation.
 *
 * @authur	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.0.01
 */
dbm.registerClass("dbm.core.globalobjects.curvecreator.timeline.LinearInterpolationTimelineCurveCreator", "dbm.core.globalobjects.curvecreator.timeline.TimelineCurveCreatorBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.curvecreator.timeline.LinearInterpolationTimelineCurveCreator");
	//"use strict";
	
	//Self reference
	var LinearInterpolationTimelineCurveCreator = dbm.importClass("dbm.core.globalobjects.curvecreator.timeline.LinearInterpolationTimelineCurveCreator");
	
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
		//console.log("dbm.core.globalobjects.curvecreator.timeline.LinearInterpolationTimelineCurveCreator");
		
		this.superCall();
		
		return this;
	};
	
	/**
	 * Creates a curve from a timeline part.
	 */
	objectFunctions.createCurveFromPart = function(aTimelinePart, aStartTime, aEndTime, aDefaultNumberOfSteps, aXOffset, aReturnCurve, aPositionOnCurve) {
		console.log("dbm.core.globalobjects.curvecreator.timeline.LinearInterpolationTimelineCurveCreator::createCurveFromPart");
		
		var currentPosition = aPositionOnCurve;
		
		var timelinePartStartTime = aTimelinePart.startTime;
		var timelinePartDuration = (aTimelinePart.endTime-timelinePartStartTime);
		
		var startXPosition = aStartTime+aXOffset;
		var startYPosition = aTimelinePart.getValueByParameter(0);
		
		dbm.singletons.dbmCurveCreator.ensureNextSegments(aReturnCurve, aPositionOnCurve, 1);
		var lastPoint = aReturnCurve.pointsArray[currentPosition];
		var lastX = lastPoint.x;
		var lastY = lastPoint.y;
		if(startXPosition !== lastX || startYPosition !== lastY) {
			dbm.singletons.dbmCurveCreator.ensureNextSegments(aReturnCurve, aPositionOnCurve, 2);
			dbm.singletons.dbmCurveCreator.setEndOfLinearSegment(lastX, lastY, startXPosition, startYPosition, aReturnCurve, currentPosition);
			currentPosition += 3;
		}
		
		var endXPosition = aEndTime+aXOffset;
		var endYPosition = aTimelinePart.getValueAt(aEndTime);
		
		dbm.singletons.dbmCurveCreator.setEndOfLinearSegment(startXPosition, startYPosition, endXPosition, endYPosition, aReturnCurve, currentPosition);
		
		currentPosition += 3;
		
		return currentPosition;
	};
	
	staticFunctions.create = function() {
		var newLinearInterpolationTimelineCurveCreator = (new ClassReference()).init();
		return newLinearInterpolationTimelineCurveCreator;
	};
});