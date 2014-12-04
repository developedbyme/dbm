/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.webrtc.IceConnectionStateTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.constants.webrtc.IceConnectionStateTypes");
	
	var IceConnectionStateTypes = dbm.importClass("dbm.constants.webrtc.IceConnectionStateTypes");
	
	staticFunctions.NEW = "new";
	staticFunctions.CHECKING = "checking";
	staticFunctions.CONNECTED = "connected";
	staticFunctions.COMPLETED = "completed";
	staticFunctions.FAILED = "failed";
	staticFunctions.DISCONNECTED = "disconnected";
	staticFunctions.CLOSED = "closed";
	
});