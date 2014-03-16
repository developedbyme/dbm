/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.constants.extendedevents.PlaybackExtendedEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.extendedevents.PlaybackExtendedEventIds");
	
	var PlaybackExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.PlaybackExtendedEventIds");
	
	staticFunctions.START_SCRUBBING = "startScrubbing";
	staticFunctions.UPDATE_SCRUBBING = "updateScrubbing";
	staticFunctions.STOP_SCRUBBING = "stopScrubbing";
	
	staticFunctions.META_DATA_LOADED = "metaDataLoaded";
	
});