/**
 * Base class for a set of points.
 *
 * @author	Mattias Ekendahl (mattias@developedbyme.com)
 * @version	0.5.02
 */
/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.data.points.PointSet", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.points.PointSet");
	//"use strict";
	
	var PointSet = dbm.importClass("com.developedbyme.core.data.points.PointSet");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.data.points.PointSet");
		
		this.superCall();
		
		this.pointsArray = new Array();
		this.setType = "none";
		
		return this;
	};
	
	/**
	 * Base function for determin if a set is of a special kind. Should be overridden.
	 *
	 * @param	aType	The type of set to be matched.
	 * @return	Always false.
	 */
	objectFunctions.isSetType = function(aType) {
		return (aType === this.setType);
	};
	
	objectFunctions.getNumberOfPoints = function() {
		return this.pointsArray.length;
	};
	
	/**
	 * Sets up the point set from a one 1d array.
	 *
	 * @param	aArray	The array of values to be set to the points.
	 */
	objectFunctions.setupFromArray = function(aArray, aNumberOfDimesions) {
		//console.log("com.developedbyme.core.data.points.PointSet::setupFromArray");
		var currentArray = aArray;
		var theLength = currentArray.length;
		if((theLength/aNumberOfDimesions) !== Math.floor(theLength/aNumberOfDimesions)) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "setupFromArray", "Length " + (theLength) + " doesn't fit dimensions (" + aNumberOfDimesions + ").");
			return;
		}
		this.pointsArray = new Array(theLength/aNumberOfDimesions);
		var dataArray = new Array(aNumberOfDimesions);
		for(var i = 0; i < theLength; i += aNumberOfDimesions) {
			for(var j = 0; j < aNumberOfDimesions; j++) {
				dataArray[j] = currentArray[i+j];
			}
			var newPoint = (new Point()).init();
			newPoint.setupFromArray(dataArray);
			this.pointsArray[(i/aNumberOfDimesions)] = newPoint;
		}
	};
	
	/**
	 * Fills the point set with "empty" points
	 *
	 * @param	aLength	The number of points to add
	 */
	objectFunctions.fillWithEmptyPoints = function(aLength) {
		var pointClass = this._pointClass;
		
		this.pointsArray = new Array(aLength);
		for(var i = -1; ++i < aLength;) {
			this.pointsArray[i] = Point.create();
		}
	};
	
	/**
	 * Duplicates the object without the data flow connections.
	 *
	 * @return	The newly created object.
	 */
	objectFunctions.duplicate = function() {
		var theObject = (new ClassReference());
		var currentArray = this.pointsArray;
		var outputArray = theObject.pointsArray;
		var theLength = currentArray.length;
		for(var i = 0; i < theLength; i++) {
			outputArray.push(currentArray[i].duplicate());
		}
		return theObject;
	};
	
	objectFunctions.reverse = function() {
		this.pointsArray.reverse();
		
		return this;
	};
	
	objectFunctions.createPoint = function(aX, aY, aZ, aW) {
		var newPoint = Point.create(aX, aY, aZ, aW);
		this.pointsArray.push(newPoint);
		return newPoint;
	};
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.destroyArrayIfExists(this.pointsArray);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.pointsArray = null;
		
		this.superCall();
	};
	
	staticFunctions.createWithLength = function(aLength) {
		var newSet = (new ClassReference()).init();
		newSet.fillWithEmptyPoints(aLength);
		return newSet;
	};
	
	staticFunctions.createWithValues = function(aValues, aNumberOfDimensions) {
		var newSet = (new ClassReference()).init();
		newSet.setupFromArray(aValues, aNumberOfDimensions);
		return newSet;
	};
	
	/**
	 * Gets a line drawer for this set.
	 *
	 * @param	aType			The type of line drawer that is wanted.
	 * @param	aStartParameter	The parameter to start drawing from.
	 * @param	aEndParameter	The parameter to stop drawing.
	 * @param	aNrOfSegments	The number of segemnts to split split up the pointset on.
	 * @param	aExactness		The exactness of the line drawer.
	 * @return	The line drawer.
	 */
	//InternalFunctionality function getLineDrawer(aType, aStartParameter, aEndParameter, aNrOfSegments = 2, aExactness = 0.1, aLineDrawer = null) {
	//	//console.log("com.developedbyme.core.data.points.PointSet.InternalFunctionality::getLineDrawer");
	//	
	//	var evaluationFunction = GlobalLink::globalObjects["curveEvaluator"].getEvaluationFunction(this, aType, (aStartParameter <= aEndParameter));
	//	return evaluationFunction(this, aStartParameter, aEndParameter, aNrOfSegments, aExactness, aLineDrawer);
	//}
});