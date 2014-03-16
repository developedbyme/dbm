/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.nodejs.constants.nodejsevents.ServerEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.constants.nodejsevents.ServerEventIds");
	//"use strict";
	
	var ServerEventIds = dbm.importClass("com.developedbyme.nodejs.constants.nodejsevents.ServerEventIds");
	
	staticFunctions.REQUEST = "request";
	staticFunctions.CONNECTION = "connection";
	staticFunctions.CLOSE = "close";
	staticFunctions.CHECK_CONTINUE = "checkContinue";
	staticFunctions.CONNECT = "connect";
	staticFunctions.UPGRADE = "upgrade";
	staticFunctions.CLEINT_ERROR = "clientError";
	staticFunctions.LISTENING = "listening";
	staticFunctions.ERROR = "error";
});