/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.webrtc.WebRtcFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.webrtc.WebRtcFunctions");
	
	var WebRtcFunctions = dbm.importClass("dbm.utils.webrtc.WebRtcFunctions");
	
	staticFunctions.getPeerConnectionClass = function() {
		console.log("dbm.utils.webrtc.WebRtcFunctions::getPeerConnectionClass");
		
		//METODO: check for other names on this
		
		return webkitRTCPeerConnection;
	};
});