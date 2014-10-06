/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A dataset for a transformation and an object.
 */
dbm.registerClass("com.developedbyme.core.data.graphics.TransformedObjectData", "com.developedbyme.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.graphics.TransformedObjectData");
	//"use strict";
	
	//Self reference
	var TransformedObjectData = dbm.importClass("com.developedbyme.core.data.graphics.TransformedObjectData");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	var TransformationData = dbm.importClass("com.developedbyme.core.data.graphics.TransformationData");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.data.graphics.TransformedObjectData");
		
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
		//console.log("com.developedbyme.core.data.graphics.TransformedObjectData::create (static)");
		var newTransformedObjectData = ClassReference._createAndInitClass(ClassReference);
		
		newTransformedObjectData.object = aObject;
		newTransformedObjectData.transformation = TransformationData.create(aX, aY, aRotation, aScaleX, aScaleY);
		
		return newTransformedObjectData;
	};
});