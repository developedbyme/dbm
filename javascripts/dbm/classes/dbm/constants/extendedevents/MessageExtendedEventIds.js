/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.extendedevents.MessageExtendedEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.constants.extendedevents.MessageExtendedEventIds");
	//"use strict";
	
	var MessageExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.MessageExtendedEventIds");
	
	staticFunctions.MESSAGE = "message";
	staticFunctions.DECODED_MESSAGE = "decodedMessage";
	
	staticFunctions.PING = "ping";
	staticFunctions.PONG = "pong";
	
});