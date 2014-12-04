/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * A dataset for filling a vector shape.
 */
dbm.registerClass("dbm.core.data.graphics.FillData", "dbm.core.data.graphics.ColorDefinitionData", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.data.graphics.FillData");
	//"use strict";
	
	//Self reference
	var FillData = dbm.importClass("dbm.core.data.graphics.FillData");
	
	//Error report
	
	//Dependencies
	
	//Utils
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	//Constants
	
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("dbm.core.data.graphics.FillData");
		
		this.superCall();
		
		return this;
	};
	
	staticFunctions.create = function(aDefinition) {
		//console.log("dbm.core.data.graphics.FillData::create (static)");
		var newFillData = ClassReference._createAndInitClass(ClassReference);
		
		if(VariableAliases.isSet(aDefinition)) {
			newFillData.definition = aDefinition;
		}
		
		return newFillData;
	};
});