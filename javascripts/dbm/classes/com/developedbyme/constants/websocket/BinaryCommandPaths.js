dbm.registerClass("com.developedbyme.constants.websocket.BinaryCommandPaths", null, function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.constants.websocket.BinaryCommandPaths");
	
	var BinaryCommandPaths = dbm.importClass("com.developedbyme.constants.websocket.BinaryCommandPaths");
	
	staticFunctions.DISCOVERY_SETUP = "internal/discovery/setup";
	
	staticFunctions.DEBUG_ECHO = "internal/debug/echo";
	staticFunctions.DEBUG_ECHO_REPLY = "internal/debug/echoReply";
	staticFunctions.DEBUG_REPORT = "internal/debug/report";
	
	staticFunctions.FLOW_ADD_PROPERTY = "dbm/flow/addProperty";
	staticFunctions.FLOW_UPDATE_PROPERTY = "dbm/flow/updateProperty";
	
});