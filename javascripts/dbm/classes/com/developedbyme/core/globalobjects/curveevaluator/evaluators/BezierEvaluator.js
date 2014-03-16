/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.curveevaluator.evaluators.BezierEvaluator", "com.developedbyme.core.globalobjects.curveevaluator.evaluators.EvaluatorBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.curveevaluator.evaluators.BezierEvaluator");
	
	var BezierEvaluator = dbm.importClass("com.developedbyme.core.globalobjects.curveevaluator.evaluators.BezierEvaluator");
	
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.curveevaluator.evaluators.BezierEvaluator::_init")
		
		this.superCall();
		
		this._halfSplitPoints = new Array();
		
		return this;
	};
	
	objectFunctions.canEvaluate = function(aPointSet) {
		//console.log("com.developedbyme.core.globalobjects.curveevaluator.evaluators.BezierEvaluator::canEvaluate");
		//console.log(aPointSet, aPointSet.isSetType("bezierCurve"));
		if(aPointSet.isSetType("bezierCurve")) {
			return true;
		}
		return false;
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
	
	objectFunctions.getPartOfSegment = function(aSegmentPoints, aStartParameter, aEndParameter, aExactness, aReturnArray, aStartLoop, aIsCompact) {
		//console.log("com.developedbyme.core.globalobjects.curveevaluator.evaluators.BezierEvaluator::getPartOfSegment");
		//console.log(aSegmentPoints, aStartParameter, aEndParameter, aExactness, aReturnArray, aStartLoop, aIsCompact);
		
		if(aStartParameter === aEndParameter) {
			return;
		}
		
		var isCompact = aIsCompact;
		
		if(aStartParameter <= aExactness && aEndParameter >= 1-aExactness) {
			var currentArray = aSegmentPoints;
			var currentArrayLength = currentArray.length;
			for(var i = aStartLoop; i < currentArrayLength; i++) {
				var currentPoint = currentArray[i];
				var newPoint = Point.create(currentPoint.x, currentPoint.y);
				aReturnArray.push(newPoint);
			}
		}
		else {
			var firstHalfArray = new Array(aSegmentPoints.length);
			var lastHalfArray = new Array(aSegmentPoints.length);
			this._getHalfsOfSegment(aSegmentPoints, firstHalfArray, lastHalfArray);
			if(aStartParameter < 0.5) {
				this.getPartOfSegment(firstHalfArray, Math.max(0, Math.min(1, 2*aStartParameter)), Math.max(0, Math.min(1, 2*aEndParameter)), 2*aExactness, aReturnArray, aStartLoop, aIsCompact);
				aStartLoop = aIsCompact;
			}
			if(aEndParameter > 0.5) {
				this.getPartOfSegment(lastHalfArray, Math.max(0, Math.min(1, 2*(aStartParameter-0.5))), Math.max(0, Math.min(1, 2*(aEndParameter-0.5))), 2*aExactness, aReturnArray, aStartLoop, aIsCompact);
			}
		}
	};
	
	objectFunctions.getPartOfCurve = function(aCurve, aStartParameter, aEndParameter, aExactness, aReturnCurve) {
		//console.log("com.developedbyme.core.globalobjects.curveevaluator.evaluators.BezierEvaluator::getPartOfCurve");
		var segmentPointsArray = new Array(aCurve.getCurveDegree()+1);
		
		var isCompact = aReturnCurve.isCompact() ? 1 : 0;
		
		var segmentStart = Math.floor(aStartParameter);
		var segmentEnd = Math.floor(aEndParameter);
		if((segmentEnd === aEndParameter) && (segmentStart !== segmentEnd)) {
			segmentEnd--;
		}
		if(segmentStart === segmentEnd) {
			aCurve._getSegmentArray(segmentStart, segmentPointsArray);
			this.getPartOfSegment(segmentPointsArray, aStartParameter-segmentStart, aEndParameter-segmentEnd, aExactness, aReturnCurve.pointsArray, 0, isCompact);
		}
		else {
			//console.log(segmentStart, segmentEnd);
			aCurve._getSegmentArray(segmentStart, segmentPointsArray);
			this.getPartOfSegment(segmentPointsArray, aStartParameter-segmentStart, 1, aExactness, aReturnCurve.pointsArray, 0, isCompact);
			for(var i = segmentStart; ++i < segmentEnd;) {
				aCurve._getSegmentArray(i, segmentPointsArray);
				this.getPartOfSegment(segmentPointsArray, 0, 1, aExactness, aReturnCurve.pointsArray, isCompact, isCompact);
			}
			aCurve._getSegmentArray(segmentEnd, segmentPointsArray);
			this.getPartOfSegment(segmentPointsArray, 0, aEndParameter-segmentEnd, aExactness, aReturnCurve.pointsArray, isCompact, isCompact);
		}
	};
});