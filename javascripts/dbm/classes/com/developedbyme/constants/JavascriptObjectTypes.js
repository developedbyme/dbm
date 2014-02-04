dbm.registerClass("com.developedbyme.constants.JavascriptObjectTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.constants.JavascriptObjectTypes");
	//"use strict";
	
	var JavascriptObjectTypes = dbm.importClass("com.developedbyme.constants.JavascriptObjectTypes");
	
	staticFunctions.TYPE_UNDEFINED = "undefined";
	staticFunctions.NON_REAL_TYPE_NULL = "null"; //MENOTE: null has type "object"
	staticFunctions.NON_REAL_TYPE_ARRAY = "array"; //MENOTE: array has type "object"
	staticFunctions.NON_REAL_TYPE_ANY = "*"; //MENOTE: there is no type for any
	staticFunctions.TYPE_OBJECT = "object";
	staticFunctions.TYPE_BOOLEAN = "boolean";
	staticFunctions.TYPE_NUMBER = "number";
	staticFunctions.TYPE_STRING = "string";
	staticFunctions.TYPE_FUNCTION = "function";
	staticFunctions.TYPE_XML = "xml";
	
});