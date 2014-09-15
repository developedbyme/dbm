/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Meta data types for playback properties.
 */
dbm.registerClass("com.developedbyme.constants.metadata.PlaybackMetaDataTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.constants.metadata.PlaybackMetaDataTypes");
	
	//Self reference
	var PlaybackMetaDataTypes = dbm.importClass("com.developedbyme.constants.metadata.PlaybackMetaDataTypes");
	
	staticFunctions.DURATION = "duration";
	staticFunctions.FRAME_RATE = "frameRate";
	
	staticFunctions.START_TIME = "startTime";
	staticFunctions.END_TIME = "endTime";
});