/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.extendedevents.WebRtcExtendedEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.constants.extendedevents.WebRtcExtendedEventIds");
	
	var WebRtcExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.WebRtcExtendedEventIds");
	
	staticFunctions.CONNECTED = "conencted";
	
	staticFunctions.OFFER_CREATED = "offerCreated";
	staticFunctions.OFFER_ERROR = "offerError";
	
	staticFunctions.ANSWER_CREATED = "answerCreated";
	staticFunctions.ANSWER_ERROR = "answerError";
	
	staticFunctions.LOCAL_DESCRIPTION_SET = "localDescriptionSet";
	staticFunctions.LOCAL_DESCRIPTION_ERROR = "localDescriptionError";
	
	staticFunctions.REMOTE_DESCRIPTION_SET = "remoteDescriptionSet";
	staticFunctions.REMOTE_DESCRIPTION_ERROR = "remoteDescriptionError";
	
	staticFunctions.NEW_ICE_CANDIDATE = "newIceCandidate";
	staticFunctions.ALL_ICE_CANDIDATES_AVAILABLE = "allIceCandidatesAvailable";
});