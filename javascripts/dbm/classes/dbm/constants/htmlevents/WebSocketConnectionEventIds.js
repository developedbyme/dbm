/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.htmlevents.WebSocketConnectionEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.constants.htmlevents.WebSocketConnectionEventIds");
	
	var WebSocketConnectionEventIds = dbm.importClass("dbm.constants.htmlevents.WebSocketConnectionEventIds");
	
	staticFunctions.OPEN = "open";
	staticFunctions.CLOSE = "close";
	staticFunctions.ERROR = "error";
	staticFunctions.MESSAGE = "message";
	
});