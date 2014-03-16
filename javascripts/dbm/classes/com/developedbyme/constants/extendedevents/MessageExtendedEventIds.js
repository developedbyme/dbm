/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.constants.extendedevents.MessageExtendedEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.extendedevents.MessageExtendedEventIds");
	//"use strict";
	
	var MessageExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.MessageExtendedEventIds");
	
	staticFunctions.MESSAGE = "message";
	staticFunctions.DECODED_MESSAGE = "decodedMessage";
	
	staticFunctions.PING = "ping";
	staticFunctions.PONG = "pong";
	
});