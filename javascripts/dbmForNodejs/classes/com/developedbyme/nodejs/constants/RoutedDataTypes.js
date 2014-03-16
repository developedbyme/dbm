/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.nodejs.constants.RoutedDataTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.constants.RoutedDataTypes");
	//"use strict";
	
	var RoutedDataTypes = dbm.importClass("com.developedbyme.nodejs.constants.RoutedDataTypes");
	
	staticFunctions.UNKNOWN = "unknown";
	staticFunctions.REQUEST = "request";
	staticFunctions.UPGRADE = "upgrade";
});