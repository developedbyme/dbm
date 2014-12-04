/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A dataset for transforming a vector shape.
 */
dbm.registerClass("dbm.core.data.graphics.TransformationData", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.data.graphics.TransformationData");
	//"use strict";
	
	//Self reference
	var TransformationData = dbm.importClass("dbm.core.data.graphics.TransformationData");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.data.graphics.TransformationData");
		
		this.superCall();
		
		this.x = 0;
		this.y = 0;
		this.rotation = 0;
		this.scaleX = 1;
		this.scaleY = 1;
		
		return this;
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("x: " + this.x);
		aReturnArray.push("y: " + this.y);
		aReturnArray.push("rotation: " + this.rotation);
		aReturnArray.push("scaleX: " + this.scaleX);
		aReturnArray.push("scaleY: " + this.scaleY);
		
	};
	
	staticFunctions.create = function(aX, aY, aRotation, aScaleX, aScaleY) {
		//console.log("dbm.core.data.graphics.TransformationData::create (static)");
		var newTransformationData = ClassReference._createAndInitClass(ClassReference);
		
		newTransformationData.x = VariableAliases.valueWithDefault(aX, 0);
		newTransformationData.y = VariableAliases.valueWithDefault(aY, 0);
		newTransformationData.rotation = VariableAliases.valueWithDefault(aRotation, 0);
		newTransformationData.scaleX = VariableAliases.valueWithDefault(aScaleX, 1);
		newTransformationData.scaleY = VariableAliases.valueWithDefault(aScaleY, 1);
		
		return newTransformationData;
	};
});