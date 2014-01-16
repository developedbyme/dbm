dbm.registerClass("com.developedbyme.constants.webrtc.IceConnectionStateTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.webrtc.IceConnectionStateTypes");
	
	var IceConnectionStateTypes = dbm.importClass("com.developedbyme.constants.webrtc.IceConnectionStateTypes");
	
	staticFunctions.NEW = "new";
	staticFunctions.CHECKING = "checking";
	staticFunctions.CONNECTED = "connected";
	staticFunctions.COMPLETED = "completed";
	staticFunctions.FAILED = "failed";
	staticFunctions.DISCONNECTED = "disconnected";
	staticFunctions.CLOSED = "closed";
	
});