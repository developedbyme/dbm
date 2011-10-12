dbm.registerClass("com.developedbyme.constants.extendedevents.PlaybackExtendedEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.extendedevents.PlaybackExtendedEventIds");
	
	var PlaybackExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.PlaybackExtendedEventIds");
	
	staticFunctions.START_SCRUBBING = "startScrubbing";
	staticFunctions.UPDATE_SCRUBBING = "updateScrubbing";
	staticFunctions.STOP_SCRUBBING = "stopScrubbing";
	
	staticFunctions.META_DATA_LOADED = "metaDataLoaded";
	
});