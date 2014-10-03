/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A dataset for filling a vector shape.
 */
dbm.registerClass("com.developedbyme.core.data.graphics.FillData", "com.developedbyme.core.data.graphics.ColorDefinitionData", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.data.graphics.FillData");
	//"use strict";
	
	//Self reference
	var FillData = dbm.importClass("com.developedbyme.core.data.graphics.FillData");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.data.graphics.FillData");
		
		this.superCall();
		
		return this;
	};
	
	staticFunctions.create = function(aDefinition) {
		//console.log("com.developedbyme.core.data.graphics.FillData::create (static)");
		var newFillData = ClassReference._createAndInitClass(ClassReference);
		
		if(VariableAliases.isSet(aDefinition)) {
			newFillData.definition = aDefinition;
		}
		
		return newFillData;
	};
});