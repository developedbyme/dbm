/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.nodejs.constants.nodejsevents.RequestEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.nodejs.constants.nodejsevents.RequestEventIds");
	//"use strict";
	
	var RequestEventIds = dbm.importClass("dbm.nodejs.constants.nodejsevents.RequestEventIds");
	
	staticFunctions.RESPONSE = "response";
	staticFunctions.SOCKET = "socket";
	staticFunctions.CONNECT = "connect";
	staticFunctions.CONTINUE = "continue";
	staticFunctions.UPGRADE = "upgrade";
	
});