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
	var ColorFunctions = dbm.importClass("com.developedbyme.utils.graphics.color.ColorFunctions");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeflashscript.flash.items.elements.ShapeElementItem::_init");
		
		this.superCall();
		
		this._nativeItem = null;
		this._parts = null;
		this._elementType = "shape";
		
		return this;
	};
	
	objectFunctions.setNativeItem = function(aNativeItem) {
		this._nativeItem = aNativeItem;
		
		return this;
	};
	
	objectFunctions.getParts = function() {
		return this._parts;
	};
	
	objectFunctions.setupParts = function() {
		//console.log("com.developedbyme.adobeflashscript.flash.items.elements.ShapeElementItem::setupParts");
		
		this._parts = new Array();
		
		var nativeMatrix = this._nativeItem.matrix;
		
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
					
					var newCurve = this._createCurveFromHalfEdge(currentContour.getHalfEdge(), currentContour.orientation, false, nativeMatrix);
					newShapePart.curve = newCurve;
					newShapePart.fillStyle = {"style": currentFill.style, "color": ColorFunctions.createColorFromHexWithOptionalAlphaString(currentFill.color).getCssString()};
				}
				else {
					//METODO: add holes
					//MENOTE: fills are not the same on the contours, need another way to match them
					//var containerPart = DataSelector.selectObjectByDynamicVariable("nativeFill", currentFill, this._parts);
					//console.log(containerPart);
					var newCurve = this._createCurveFromHalfEdge(currentContour.getHalfEdge(), currentContour.orientation, true, nativeMatrix);
					
					//MEDEBUG: this should make a hole instead of adding a part
					var newShapePart = ShapePart.create();
					this._parts.push(newShapePart);
					newShapePart.curve = newCurve;
				}
				
				//console.log(currentContour, currentContour.fill.style, currentContour.fill.color, currentContour.interior, currentContour.orientation, currentContour.getHalfEdge().id, currentContour.getHalfEdge().getOppositeHalfEdge().id);
			}
		}
	};
	
	objectFunctions._createCurveFromHalfEdge = function(aHalfEdge, aOrientation, aShouldBeFirstHalf, aMatrix) {
		//console.log("com.developedbyme.adobeflashscript.flash.items.elements.ShapeElementItem::_createCurveFromHalfEdge");
		//console.log(aHalfEdge, aOrientation, aShouldBeFirstHalf);
		
		var returnCurve = BezierCurve.create(2, true);
		var pointsArray = returnCurve.pointsArray
		Point.adjustPointsArrayLength(pointsArray, 1);
		
		var startHalfEdge = aHalfEdge;
		var currentHalfEdge = startHalfEdge;
		
		var flipValue = ((currentHalfEdge.getEdge().getHalfEdge(0).id === currentHalfEdge.id) === aShouldBeFirstHalf) ? 1 : -1;
		
		var startPoint = currentHalfEdge.getEdge().getControl(1-flipValue);
		pointsArray[0].setValues(startPoint.x+aMatrix.tx, startPoint.y+aMatrix.ty);
		
		//console.log(startPoint.x, startPoint.y);
		
		//METODO: change matrix to be applied after instead of just looking at positions
		
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
			
			pointsArray[currentPosition].setValues(currentControl.x+aMatrix.tx, currentControl.y+aMatrix.ty);
			pointsArray[currentPosition+1].setValues(currentPoint.x+aMatrix.tx, currentPoint.y+aMatrix.ty);
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