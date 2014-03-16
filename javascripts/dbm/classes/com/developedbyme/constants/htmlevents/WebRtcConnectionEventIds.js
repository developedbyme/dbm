/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.constants.htmlevents.WebRtcConnectionEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.htmlevents.WebRtcConnectionEventIds");
	
	var WebRtcConnectionEventIds = dbm.importClass("com.developedbyme.constants.htmlevents.WebRtcConnectionEventIds");
	
	staticFunctions.ICE_CANDIDATE = "icecandidate";
	staticFunctions.ICE_CONNECTION_STATE_CHANGE = "iceconnectionstatechange";
	staticFunctions.ADD_STREAM = "addstream";
	staticFunctions.DATA_CHANNEL = "datachannel";
	staticFunctions.REMOVE_STREAM = "removestream";
	staticFunctions.NEGOTIATION_NEEDED = "negotiationneeded";
	staticFunctions.SIGNALING_STATE_CHANGE = "signalingstatechange";
	
});