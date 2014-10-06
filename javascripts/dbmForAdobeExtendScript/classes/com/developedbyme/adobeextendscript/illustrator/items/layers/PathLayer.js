/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.adobeextendscript.illustrator.items.layers.PathLayer", "com.developedbyme.adobeextendscript.illustrator.items.layers.LayerBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.adobeextendscript.illustrator.items.layers.PathLayer");
	//"use strict";
	
	//Self reference
	var PathLayer = dbm.importClass("com.developedbyme.adobeextendscript.illustrator.items.layers.PathLayer");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var TreeStructureItem = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItem");
	var BezierCurve = dbm.importClass("com.developedbyme.core.data.curves.BezierCurve");
	var ShapeData = dbm.importClass("com.developedbyme.core.data.graphics.ShapeData");
	var FillData = dbm.importClass("com.developedbyme.core.data.graphics.FillData");
	var StrokeData = dbm.importClass("com.developedbyme.core.data.graphics.StrokeData");
	
	//Utils
	var ExternalVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalVariableProperty");
	var NativeColorConverter = dbm.importClass("com.developedbyme.adobeextendscript.illustrator.utils.color.NativeColorConverter");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.adobeextendscript.illustrator.items.layers.PathLayer::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions.setupItem = function(aNativeItem) {
		//console.log("com.developedbyme.adobeextendscript.illustrator.items.layers.PathLayer::setupItem");
		
		this.superCall(aNativeItem);
		
		return this;
	};
	
	objectFunctions.generateCurve = function(aOffsetX, aOffsetY) {
		var returnCurve = BezierCurve.create(3, true);
		
		var currentArray = this._nativeItem.pathPoints;
		var currentArrayLength = currentArray.length-1; //MENOTE: first and last point is done outside the loop
		
		var lastNativePoint = currentArray[0];
		returnCurve.createPoint(lastNativePoint.anchor[0]-aOffsetX, -1*lastNativePoint.anchor[1]-aOffsetY);
		returnCurve.createPoint(lastNativePoint.rightDirection[0]-aOffsetX, -1*lastNativePoint.rightDirection[1]-aOffsetY);
		
		for(var i = 1; i < currentArrayLength; i++) { //MENOTE: first and last point is done outside the loop
			var currentNativePoint = currentArray[i];
			returnCurve.createPoint(currentNativePoint.leftDirection[0]-aOffsetX, -1*currentNativePoint.leftDirection[1]-aOffsetY);
			returnCurve.createPoint(currentNativePoint.anchor[0]-aOffsetX, -1*currentNativePoint.anchor[1]-aOffsetY);
			returnCurve.createPoint(currentNativePoint.rightDirection[0]-aOffsetX, -1*currentNativePoint.rightDirection[1]-aOffsetY);
			lastNativePoint = currentNativePoint;
		}
		
		var currentNativePoint = currentArray[currentArrayLength];
		returnCurve.createPoint(currentNativePoint.leftDirection[0]-aOffsetX, -1*currentNativePoint.leftDirection[1]-aOffsetY);
		returnCurve.createPoint(currentNativePoint.anchor[0]-aOffsetX, -1*currentNativePoint.anchor[1]-aOffsetY);
		
		if(this._nativeItem.closed) {
			returnCurve.createPoint(currentNativePoint.rightDirection[0]-aOffsetX, -1*currentNativePoint.rightDirection[1]-aOffsetY);
			lastNativePoint = currentNativePoint;
			var currentNativePoint = currentArray[0];
			returnCurve.createPoint(currentNativePoint.leftDirection[0]-aOffsetX, -1*currentNativePoint.leftDirection[1]-aOffsetY);
			returnCurve.createPoint(currentNativePoint.anchor[0]-aOffsetX, -1*currentNativePoint.anchor[1]-aOffsetY);
		}
		
		return returnCurve;
	};
	
	objectFunctions.generateShapeData = function(aOffsetX, aOffsetY) {
		var returnData = ShapeData.create();
		
		returnData.curves.push(this.generateCurve(aOffsetX, aOffsetY));
		if(this._nativeItem.filled) {
			returnData.fill = FillData.create(NativeColorConverter.convertNativeObject(this._nativeItem.fillColor));
		}
		if(this._nativeItem.stroked) {
			returnData.stroke = StrokeData.create(this._nativeItem.strokeWidth, NativeColorConverter.convertNativeObject(this._nativeItem.strokeColor));
		}
		
		
		return returnData;
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.superCall();
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
		//console.log("com.developedbyme.adobeextendscript.illustrator.items.layers.PathLayer::create");
		//console.log(aNativeItem);
		
		var newPathLayer = (new ClassReference()).init();
		
		newPathLayer.setupItem(aNativeItem);
		
		return newPathLayer;
	};
});