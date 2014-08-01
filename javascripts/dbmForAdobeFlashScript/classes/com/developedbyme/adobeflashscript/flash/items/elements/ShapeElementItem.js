/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.adobeflashscript.flash.items.elements.ShapeElementItem", "com.developedbyme.adobeflashscript.flash.items.elements.ElementItem", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.adobeflashscript.flash.items.elements.ShapeElementItem");
	//"use strict";
	
	//Self reference
	var ShapeElementItem = dbm.importClass("com.developedbyme.adobeflashscript.flash.items.elements.ShapeElementItem");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var ExternalVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalVariableProperty");
	var ShapePart = dbm.importClass("com.developedbyme.adobeflashscript.flash.items.elements.ShapePart");
	var BezierCurve = dbm.importClass("com.developedbyme.core.data.curves.BezierCurve");
	var Point = dbm.importClass("com.developedbyme.core.data.points.Point");
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var DataSelector = dbm.importClass("com.developedbyme.utils.data.DataSelector");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeflashscript.flash.items.elements.ShapeElementItem::_init");
		
		this.superCall();
		this._parts = null;
		
		return this;
	};
	
	objectFunctions.setNativeItem = function(aNativeItem) {
		this.superCall(aNativeItem);
		
		return this;
	};
	
	objectFunctions.getParts = function() {
		return this._parts;
	};
	
	objectFunctions.setupParts = function() {
		console.log("com.developedbyme.adobeflashscript.flash.items.elements.ShapeElementItem::setupParts");
		console.log(this._nativeItem.numCubicSegments);
		console.log(this._nativeItem.edges);
		console.log(this._nativeItem.contours);
		
		this._parts = new Array();
		
		var currentArray = this._nativeItem.contours;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentContour = currentArray[i];
			var currentFill = currentContour.fill;
			if(currentFill.style === "noFill") {
				//MENOTE: skip unless it's a line
				//var newCurve = this._createCurveFromHalfEdge(currentContour.getHalfEdge(), currentContour.orientation, 1);
			}
			else {
				if(currentContour.interior) {
					var newShapePart = ShapePart.create();
					this._parts.push(newShapePart);
					
					var newCurve = this._createCurveFromHalfEdge(currentContour.getHalfEdge(), currentContour.orientation, false);
					newShapePart.curve = newCurve;
					newShapePart.fillStyle = {"style": currentFill.style, "color": currentFill.color};
				}
				else {
					//METODO: add holes
					//MENOTE: fills are not the same on the contours, need another way to match them
					//var containerPart = DataSelector.selectObjectByDynamicVariable("nativeFill", currentFill, this._parts);
					//console.log(containerPart);
					var newCurve = this._createCurveFromHalfEdge(currentContour.getHalfEdge(), currentContour.orientation, true);
					
					//MEDEBUG: this should make a hole instead of adding a part
					var newShapePart = ShapePart.create();
					this._parts.push(newShapePart);
					newShapePart.curve = newCurve;
				}
				
				console.log(currentContour, currentContour.fill.style, currentContour.fill.color, currentContour.interior, currentContour.orientation, currentContour.getHalfEdge().id, currentContour.getHalfEdge().getOppositeHalfEdge().id);
			}
		}
		console.log(this._parts);
	};
	
	objectFunctions._createCurveFromHalfEdge = function(aHalfEdge, aOrientation, aShouldBeFirstHalf) {
		//console.log("com.developedbyme.adobeflashscript.flash.items.elements.ShapeElementItem::_createCurveFromHalfEdge");
		//console.log(aHalfEdge, aOrientation, aShouldBeFirstHalf);
		
		var returnCurve = BezierCurve.create(2, true);
		var pointsArray = returnCurve.pointsArray
		Point.adjustPointsArrayLength(pointsArray, 1);
		
		var startHalfEdge = aHalfEdge;
		var currentHalfEdge = startHalfEdge;
		
		var flipValue = ((currentHalfEdge.getEdge().getHalfEdge(0).id === currentHalfEdge.id) === aShouldBeFirstHalf) ? 1 : -1;
		
		var startPoint = currentHalfEdge.getEdge().getControl(1-flipValue);
		pointsArray[0].setValues(startPoint.x, startPoint.y);
		
		//console.log(startPoint.x, startPoint.y);
		
		var debugCounter = 0;
		var currentPosition = 1;
		while(true) {
			if(debugCounter++ > 100) {
				ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_createCurveFromHalfEdge", "Loop has been running for too long.");
				break;
			}
			
			Point.adjustPointsArrayLength(pointsArray, 2);
			
			//console.log((currentHalfEdge.getEdge().getHalfEdge(0).id === currentHalfEdge.id) === aShouldBeFirstHalf);
			//console.log(currentHalfEdge.getEdge().getControl(1-flipValue).x, currentHalfEdge.getEdge().getControl(1-flipValue).y);
			//console.log(currentHalfEdge.getEdge().getControl(1+flipValue).x, currentHalfEdge.getEdge().getControl(1+flipValue).y);
			
			var currentControl = currentHalfEdge.getEdge().getControl(1);
			var currentPoint = currentHalfEdge.getEdge().getControl(1+flipValue);
			
			pointsArray[currentPosition].setValues(currentControl.x, currentControl.y);
			pointsArray[currentPosition+1].setValues(currentPoint.x, currentPoint.y);
			currentPosition += 2;
			
			if(aOrientation >= 0) {
				currentHalfEdge = currentHalfEdge.getNext();
			}
			else {
				currentHalfEdge = currentHalfEdge.getPrev();
			}
			if(currentHalfEdge.id === startHalfEdge.id) {
				break;
			}
			flipValue = ((currentHalfEdge.getEdge().getHalfEdge(0).id === currentHalfEdge.id) === aShouldBeFirstHalf) ? 1 : -1;
		}
		
		return returnCurve;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		/*
		switch(aName) {
			case "":
				return true;
		}
		*/
		
		return this.superCall(aName);
	};
	
	staticFunctions.create = function(aNativeItem) {
		//console.log("com.developedbyme.adobeflashscript.flash.items.elements.ShapeElementItem::create");
		//console.log(aPort);
		
		var newShapeElementItem = (new ClassReference()).init();
		
		newShapeElementItem.setNativeItem(aNativeItem);
		newShapeElementItem.setupParts();
		
		return newShapeElementItem;
	};
});