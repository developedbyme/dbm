/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A dataset for filling a vector shape.
 */
dbm.registerClass("com.developedbyme.core.data.graphics.StrokeData", "com.developedbyme.core.data.graphics.ColorDefinitionData", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.graphics.StrokeData");
	//"use strict";
	
	//Self reference
	var StrokeData = dbm.importClass("com.developedbyme.core.data.graphics.StrokeData");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	var LineCapTypes = dbm.importClass("com.developedbyme.constants.LineCapTypes");
	var LineJoinTypes = dbm.importClass("com.developedbyme.constants.LineJoinTypes");
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.data.graphics.StrokeData");
		
		this.superCall();
		
		this.lineWidth = 0;
		this.lineCap = LineCapTypes.BUTT;
		this.lineJoin = LineJoinTypes.MITER;
		this.miterLimit = 10;
		
		return this;
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("lineWidth: " + this.lineWidth);
		aReturnArray.push("lineCap: " + this.lineCap);
		aReturnArray.push("lineJoin: " + this.lineJoin);
		aReturnArray.push("miterLimit: " + this.miterLimit);
		
	};
	
	staticFunctions.create = function(aLineWidth, aDefinition) {
		//console.log("com.developedbyme.core.data.graphics.StrokeData::create (static)");
		var newStrokeData = ClassReference._createAndInitClass(ClassReference);
		
		if(VariableAliases.isSet(aLineWidth)) {
			newStrokeData.lineWidth = aLineWidth;
		}
		if(VariableAliases.isSet(aDefinition)) {
			newStrokeData.definition = aDefinition;
		}
		
		return newStrokeData;
	};
});