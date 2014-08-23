/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Types of breakdown parts that are specific to dbm structure when compiling a script.
 */
dbm.registerClass("com.developedbyme.constants.compiler.DbmBreakdownTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.constants.compiler.DbmBreakdownTypes");
	
	//Self reference
	var DbmBreakdownTypes = dbm.importClass("com.developedbyme.constants.compiler.DbmBreakdownTypes");
	
	staticFunctions.IMPORT_CLASS = "dbmImportClass";
	staticFunctions.REGISTER_CLASS = "dbmRegisterClass";
	
});