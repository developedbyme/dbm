/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.nodejs.constants.nodejsevents.WebSocketServerConnectionEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.constants.nodejsevents.WebSocketServerConnectionEventIds");
	//"use strict";
	
	var WebSocketServerConnectionEventIds = dbm.importClass("com.developedbyme.nodejs.constants.nodejsevents.WebSocketServerConnectionEventIds");
	
	staticFunctions.DATA = "data";
	staticFunctions.ERROR = "error";
	staticFunctions.TIMEOUT = "timeout";
	staticFunctions.END = "end";
	staticFunctions.CLOSE = "close";
});