/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Base object for objects that have a color, gradient, pattern defined.
 */
dbm.registerClass("dbm.core.data.graphics.ColorDefinitionData", "dbm.core.BaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.data.graphics.ColorDefinitionData");
	//"use strict";
	
	//Self reference
	var ColorDefinitionData = dbm.importClass("dbm.core.data.graphics.ColorDefinitionData");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.data.graphics.ColorDefinitionData");
		
		this.superCall();
		
		this.definition = null;
		
		return this;
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("definition: " + this.definition);
		
	};
	
	staticFunctions.create = function() {
		//console.log("dbm.core.data.graphics.ColorDefinitionData::create (static)");
		var newColorDefinitionData = ClassReference._createAndInitClass(ClassReference);
		
		return newColorDefinitionData;
	};
});