/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.nodejs.constants.RoutedDataTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.nodejs.constants.RoutedDataTypes");
	//"use strict";
	
	var RoutedDataTypes = dbm.importClass("dbm.nodejs.constants.RoutedDataTypes");
	
	staticFunctions.UNKNOWN = "unknown";
	staticFunctions.REQUEST = "request";
	staticFunctions.UPGRADE = "upgrade";
});