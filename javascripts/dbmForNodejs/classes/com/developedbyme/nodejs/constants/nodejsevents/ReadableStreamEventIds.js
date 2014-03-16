/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.nodejs.constants.nodejsevents.ReadableStreamEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.constants.nodejsevents.ReadableStreamEventIds");
	//"use strict";
	
	var ReadableStreamEventIds = dbm.importClass("com.developedbyme.nodejs.constants.nodejsevents.ReadableStreamEventIds");
	
	staticFunctions.READABLE = "readable";
	staticFunctions.DATA = "data";
	staticFunctions.END = "end";
	staticFunctions.CLOSE = "close";
	staticFunctions.ERROR = "error";
	
});