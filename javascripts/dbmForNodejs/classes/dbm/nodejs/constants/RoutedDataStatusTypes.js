/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.nodejs.constants.RoutedDataStatusTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.nodejs.constants.RoutedDataStatusTypes");
	//"use strict";
	
	var RoutedDataStatusTypes = dbm.importClass("dbm.nodejs.constants.RoutedDataStatusTypes");
	
	staticFunctions.UNKNOWN = "unknown";
	staticFunctions.UNHANDLED = "unhandled";
	staticFunctions.DONE = "done";
	staticFunctions.ERROR = "error";
	staticFunctions.UNHANDLED_EXCLUSIVE = "unhandledExclusive";
});