/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.websocket.BinaryCommandPaths", null, function(objectFunctions, staticFunctions) {
	//console.log("dbm.constants.websocket.BinaryCommandPaths");
	
	var BinaryCommandPaths = dbm.importClass("dbm.constants.websocket.BinaryCommandPaths");
	
	staticFunctions.DISCOVERY_SETUP = "internal/discovery/setup";
	
	staticFunctions.DEBUG_ECHO = "internal/debug/echo";
	staticFunctions.DEBUG_ECHO_REPLY = "internal/debug/echoReply";
	staticFunctions.DEBUG_REPORT = "internal/debug/report";
	
	staticFunctions.FLOW_ADD_PROPERTY = "dbm/flow/addProperty";
	staticFunctions.FLOW_UPDATE_PROPERTY = "dbm/flow/updateProperty";
	
});