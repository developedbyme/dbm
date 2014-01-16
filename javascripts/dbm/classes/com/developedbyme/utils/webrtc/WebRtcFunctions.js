dbm.registerClass("com.developedbyme.utils.webrtc.WebRtcFunctions", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.webrtc.WebRtcFunctions");
	
	var WebRtcFunctions = dbm.importClass("com.developedbyme.utils.webrtc.WebRtcFunctions");
	
	staticFunctions.getPeerConnectionClass = function() {
		console.log("com.developedbyme.utils.webrtc.WebRtcFunctions::getPeerConnectionClass");
		
		//METODO: check for other names on this
		
		return webkitRTCPeerConnection;
	};
});