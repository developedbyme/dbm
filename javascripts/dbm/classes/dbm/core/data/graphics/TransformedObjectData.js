/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A dataset for a transformation and an object.
 */
dbm.registerClass("dbm.core.data.graphics.TransformedObjectData", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.data.graphics.TransformedObjectData");
	//"use strict";
	
	//Self reference
	var TransformedObjectData = dbm.importClass("dbm.core.data.graphics.TransformedObjectData");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	var TransformationData = dbm.importClass("dbm.core.data.graphics.TransformationData");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.data.graphics.TransformedObjectData");
		
		this.superCall();
		
		this.object = null;
		this.transformation = null;
		
		return this;
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("object: " + this.object);
		aReturnArray.push("transformation: " + this.transformation);
		
	};
	
	staticFunctions.create = function(aObject, aX, aY, aRotation, aScaleX, aScaleY) {
		//console.log("dbm.core.data.graphics.TransformedObjectData::create (static)");
		var newTransformedObjectData = ClassReference._createAndInitClass(ClassReference);
		
		newTransformedObjectData.object = aObject;
		newTransformedObjectData.transformation = TransformationData.create(aX, aY, aRotation, aScaleX, aScaleY);
		
		return newTransformedObjectData;
	};
});