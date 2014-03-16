/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.nodejs.constants.WebSocketOpcodeIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.nodejs.constants.WebSocketOpcodeIds");
	//"use strict";
	
	var WebSocketOpcodeIds = dbm.importClass("com.developedbyme.nodejs.constants.WebSocketOpcodeIds");
	
	staticFunctions.CONTINUATION = 0;
	staticFunctions.TEXT = 0x01;
	staticFunctions.BINARY = 0x02;
	staticFunctions.CLOSE = 0x08;
	staticFunctions.PING = 0x09;
	staticFunctions.PONG = 0x0A;
	
});