/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.ConditionOperationTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("dbm.constants.ConditionOperationTypes");
	//"use strict";
	
	var ConditionOperationTypes = dbm.importClass("dbm.constants.ConditionOperationTypes");
	
	staticFunctions.EQUAL = "==";
	staticFunctions.IDENTICALLY_EQUAL = "===";
	
	staticFunctions.NOT_EQUAL = "!=";
	staticFunctions.NOT_IDENTICALLY_EQUAL = "!==";
	
	staticFunctions.GREATER_THAN = ">";
	staticFunctions.GREATER_THAN_OR_EQUAL = ">=";
	
	staticFunctions.LESSER_THAN = "<";
	staticFunctions.LESSER_THAN_OR_EQUAL = "<=";
	
	staticFunctions.AND = "&&";
	staticFunctions.OR = "||";
});