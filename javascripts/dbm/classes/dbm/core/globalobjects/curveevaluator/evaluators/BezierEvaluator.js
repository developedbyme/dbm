/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.curveevaluator.evaluators.BezierEvaluator", "dbm.core.globalobjects.curveevaluator.evaluators.EvaluatorBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.curveevaluator.evaluators.BezierEvaluator");
	
	//Self reference
	var BezierEvaluator = dbm.importClass("dbm.core.globalobjects.curveevaluator.evaluators.BezierEvaluator");
	
	//Error report
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	//Dependencies
	var Point = dbm.importClass("dbm.core.data.points.Point");
	var PositionedArrayHolder = dbm.importClass("dbm.utils.data.PositionedArrayHolder");
	
	//Utils
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.curveevaluator.evaluators.BezierEvaluator::_init")
		
		this.superCall();
		
		this._halfSplitPoints = new Array();
		
		this._tempPoint1 = Point.create();
		this._tempPoint2 = Point.create();
		
		return this;
	};
	
	objectFunctions.canEvaluate = function(aPointSet) {
		//console.log("dbm.core.globalobjects.curveevaluator.evaluators.BezierEvaluator::canEvaluate");
		//console.log(aPointSet, aPointSet.isSetType("bezierCurve"));
		if(aPointSet.isSetType("bezierCurve")) {
			return true;
		}
		return false;
	};
	
	objectFunctions._ensureReturnLength = function(aReturnArrayPositioning, aLength) {
		//console.log("dbm.core.globalobjects.curveevaluator.evaluators.BezierEvaluator::_ensureReturnLength");
		
		var pointsToAdd = aReturnArrayPositioning.position+aLength-aReturnArrayPositioning.numberOfItems;
		if(pointsToAdd > 0) {
			var currentArray = aReturnArrayPositioning.array;
			for(var i = 0; i < pointsToAdd; i++) {
				currentArray.push(Point.create());
			}
			aReturnArrayPositioning.numberOfItems += pointsToAdd;
		}
	};
	
	objectFunctions._ensureSlipPointLength = function(aLength) {
		var currentArray = this._halfSplitPoints;
		var currentArrayLength = currentArray.length;
		for(var i = currentArrayLength; i < aLength; i++) {
			var newLength = i+1;
			var newArray = new Array(newLength);
			currentArray[i] = newArray;
			for(var j = 0; j < newLength; j++) {
				newArray[j] = Point.create();
			}
		}
	};
	
	objectFunctions._getHalfsOfSegment = function(aSegmentPoints, aFirstHalfPoints, aLastHalfPoints) {
		var segmentLength = aSegmentPoints.length;
		
		this._ensureSlipPointLength(segmentLength-1);
		
		aFirstHalfPoints[0] = aSegmentPoints[0].duplicate();
		aLastHalfPoints[segmentLength-1] = aSegmentPoints[segmentLength-1].duplicate();
		
		var currentSplitPointArray = aSegmentPoints;
		for(var i = 1; i < segmentLength; i++) {
			var newSplitArray = this._halfSplitPoints[segmentLength-i-1];
			var newSplitArrayLength = newSplitArray.length;
			for(var j = 0; j < newSplitArrayLength; j++) {
				//METODO: store points in local variables
				//METODO: simplify math
				newSplitArray[j].x = 0.5*currentSplitPointArray[j].x+0.5*currentSplitPointArray[j+1].x;
				newSplitArray[j].y = 0.5*currentSplitPointArray[j].y+0.5*currentSplitPointArray[j+1].y;
				newSplitArray[j].z = 0.5*currentSplitPointArray[j].z+0.5*currentSplitPointArray[j+1].z;
			}
			
			currentSplitPointArray = newSplitArray;
		}
		
		var middlePoint = this._halfSplitPoints[0][0];
		aFirstHalfPoints[segmentLength-1] = middlePoint.duplicate();
		aLastHalfPoints[0] = middlePoint.duplicate();
		
		for(var i = 1; i < segmentLength-1; i++) {
			aFirstHalfPoints[segmentLength-1-i] = this._halfSplitPoints[i][0].duplicate();
			aLastHalfPoints[i] = this._halfSplitPoints[i][i].duplicate();
		}
	};
	
	objectFunctions.getPartOfSegment = function(aSegmentPoints, aStartParameter, aEndParameter, aExactness, aReturnArrayPositioning, aStartLoop, aIsCompact) {
		//console.log("dbm.core.globalobjects.curveevaluator.evaluators.BezierEvaluator::getPartOfSegment");
		//console.log(aSegmentPoints, aStartParameter, aEndParameter, aExactness, aReturnArrayPositioning, aStartLoop, aIsCompact);
		
		var aReturnArray = aReturnArrayPositioning.array;
		
		if(aStartParameter === aEndParameter) {
			return;
		}
		
		if(aStartParameter <= aExactness && aEndParameter >= 1-aExactness) {
			
			var currentArray = aSegmentPoints;
			var currentArrayLength = currentArray.length;
			
			var addLength = currentArrayLength-aStartLoop;
			this._ensureReturnLength(aReturnArrayPositioning, addLength);
			var startReturnPosition = aReturnArrayPositioning.position-aStartLoop;
			
			for(var i = aStartLoop; i < currentArrayLength; i++) {
				var currentPoint = currentArray[i];
				Point.setValues3d(aReturnArray[startReturnPosition+i], currentPoint.x, currentPoint.y, currentPoint.z);
			}
			
			aReturnArrayPositioning.position += addLength;
		}
		else if(aSegmentPoints.length === 4) {
			
			var addLength = 4-aStartLoop;
			this._ensureReturnLength(aReturnArrayPositioning, addLength);
			var startPosition = aReturnArrayPositioning.position;
			
			var newPoint2 = aReturnArray[startPosition+addLength-3];
			var newPoint3 = aReturnArray[startPosition+addLength-2];
			var newPoint4 = aReturnArray[startPosition+addLength-1];
			dbm.singletons.dbmCurveEvaluator.getPointOnBezierSegment3d(aSegmentPoints, aEndParameter, newPoint4);
		
			var newPoint1 = this._tempPoint1;
			dbm.singletons.dbmCurveEvaluator.getPointOnBezierSegment3d(aSegmentPoints, aStartParameter, newPoint1);
			
			var scale = aEndParameter-aStartParameter;
			
			var tangent = this._tempPoint2;
			
			dbm.singletons.dbmCurveEvaluator.getTangentOnBezierSegment2d(aSegmentPoints, aStartParameter, tangent); //METODO: this needs to work in 3d
			Point.setValues3d(newPoint2, newPoint1.x+(((scale)/3)*tangent.x), newPoint1.y+(((scale)/3)*tangent.y), newPoint1.z+(((scale)/3)*tangent.z));
			
			dbm.singletons.dbmCurveEvaluator.getTangentOnBezierSegment2d(aSegmentPoints, aEndParameter, tangent); //METODO: this needs to work in 3d
			Point.setValues3d(newPoint3, newPoint4.x-(((scale)/3)*tangent.x), newPoint4.y-(((scale)/3)*tangent.y), newPoint4.z-(((scale)/3)*tangent.z));
			
			if(!aStartLoop) {
				newPoint1 = aReturnArray[startPosition+addLength-4];
				Point.copyPointValues3d(newPoint1, aReturnArray[startPosition]);
			}
			
			aReturnArrayPositioning.position += addLength;
		}
		else {
			var firstHalfArray = new Array(aSegmentPoints.length);
			var lastHalfArray = new Array(aSegmentPoints.length);
			this._getHalfsOfSegment(aSegmentPoints, firstHalfArray, lastHalfArray);
			if(aStartParameter < 0.5) {
				this.getPartOfSegment(firstHalfArray, Math.max(0, Math.min(1, 2*aStartParameter)), Math.max(0, Math.min(1, 2*aEndParameter)), 2*aExactness, aReturnArrayPositioning, aStartLoop, aIsCompact);
				aStartLoop = aIsCompact;
			}
			if(aEndParameter > 0.5) {
				this.getPartOfSegment(lastHalfArray, Math.max(0, Math.min(1, 2*(aStartParameter-0.5))), Math.max(0, Math.min(1, 2*(aEndParameter-0.5))), 2*aExactness, aReturnArrayPositioning, aStartLoop, aIsCompact);
			}
		}
	};
	
	objectFunctions.getPartOfCurve = function(aCurve, aStartParameter, aEndParameter, aExactness, aReturnCurve) {
		//console.log("dbm.core.globalobjects.curveevaluator.evaluators.BezierEvaluator::getPartOfCurve");
		var segmentPointsArray = new Array(aCurve.getCurveDegree()+1);
		
		var isCompact = aReturnCurve.isCompact() ? 1 : 0;
		
		var returnArrayPositioning = PositionedArrayHolder.createFromArray(aReturnCurve.pointsArray, false);
		
		var maxParameter = (aCurve.pointsArray.length-isCompact)/(aCurve.getCurveDegree()-isCompact);
		if(aStartParameter > maxParameter) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "getPartOfCurve", "Start parameter is out of range " + aStartParameter + " > " + maxParameter + ".");
			
			aStartParameter = maxParameter;
		}
		if(aEndParameter > maxParameter) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "getPartOfCurve", "End parameter is out of range " + aEndParameter + " > " + maxParameter + ".");
			
			aEndParameter = maxParameter;
		}
		
		var segmentStart = Math.floor(aStartParameter);
		var segmentEnd = Math.floor(aEndParameter);
		if((segmentEnd === aEndParameter) && (segmentStart !== segmentEnd)) {
			segmentEnd--;
		}
		if(segmentStart === segmentEnd) {
			aCurve._getSegmentArray(segmentStart, segmentPointsArray);
			this.getPartOfSegment(segmentPointsArray, aStartParameter-segmentStart, aEndParameter-segmentEnd, aExactness, returnArrayPositioning, 0, isCompact);
		}
		else {
			//console.log(segmentStart, segmentEnd);
			aCurve._getSegmentArray(segmentStart, segmentPointsArray);
			this.getPartOfSegment(segmentPointsArray, aStartParameter-segmentStart, 1, aExactness, returnArrayPositioning, 0, isCompact);
			for(var i = segmentStart; ++i < segmentEnd;) {
				aCurve._getSegmentArray(i, segmentPointsArray);
				this.getPartOfSegment(segmentPointsArray, 0, 1, aExactness, returnArrayPositioning, isCompact, isCompact);
			}
			aCurve._getSegmentArray(segmentEnd, segmentPointsArray);
			this.getPartOfSegment(segmentPointsArray, 0, aEndParameter-segmentEnd, aExactness, returnArrayPositioning, isCompact, isCompact);
		}
		
		var currentArray = aReturnCurve.pointsArray;
		var currentArrayLength = currentArray.length;
		for(var i = returnArrayPositioning.position; i < currentArrayLength; i++) {
			currentArray[i].destroy();
		}
		currentArray.splice(returnArrayPositioning.position, currentArrayLength-returnArrayPositioning.position);
		
		returnArrayPositioning.destroy();
	};
});