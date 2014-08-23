/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Types of documentation.
 */
dbm.registerClass("com.developedbyme.constants.compiler.DocumentationTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.constants.compiler.DocumentationTypes");
	
	//Self reference
	var DocumentationTypes = dbm.importClass("com.developedbyme.constants.compiler.DocumentationTypes");
	
	/**
	 * Code that is not relevant for any class, function or variable.
	 */
	staticFunctions.CODE = "code";
	
	staticFunctions.CLASS = "class";
	staticFunctions.FUNCTION = "function";
	staticFunctions.VARIABLE = "variable";
	
	staticFunctions.LOCAL_CLASS_VARIABLE = "localClassVariable";
	staticFunctions.STATIC_CLASS_VARIABLE = "staticClassVariable";
	
	staticFunctions.LOCAL_CLASS_FUNCTION = "localClassFunction";
	staticFunctions.STATIC_CLASS_FUNCTION = "staticClassFunction";
	
});