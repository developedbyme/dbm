/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Object types for all javascript objects.
 */
dbm.registerClass("dbm.constants.javascriptlanguage.JavascriptObjectTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("dbm.constants.javascriptlanguage.JavascriptObjectTypes");
	//"use strict";
	
	//Self reference
	var JavascriptObjectTypes = dbm.importClass("dbm.constants.javascriptlanguage.JavascriptObjectTypes");
	
	staticFunctions.TYPE_UNDEFINED = "undefined";
	staticFunctions.NON_REAL_TYPE_NULL = "null"; //MENOTE: null has type "object"
	staticFunctions.NON_REAL_TYPE_ARRAY = "array"; //MENOTE: array has type "object"
	staticFunctions.NON_REAL_TYPE_ANY = "*"; //MENOTE: there is no type for any
	staticFunctions.NON_REAL_TYPE_UNKNOWN = "unknown"; //MENOTE: there is no type for unknown
	staticFunctions.TYPE_OBJECT = "object";
	staticFunctions.TYPE_BOOLEAN = "boolean";
	staticFunctions.TYPE_NUMBER = "number";
	staticFunctions.TYPE_STRING = "string";
	staticFunctions.TYPE_FUNCTION = "function";
	staticFunctions.TYPE_XML = "xml";
	
});