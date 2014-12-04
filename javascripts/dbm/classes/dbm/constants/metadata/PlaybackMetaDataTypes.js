/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
/**
 * Meta data types for playback properties.
 */
dbm.registerClass("dbm.constants.metadata.PlaybackMetaDataTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("dbm.constants.metadata.PlaybackMetaDataTypes");
	
	//Self reference
	var PlaybackMetaDataTypes = dbm.importClass("dbm.constants.metadata.PlaybackMetaDataTypes");
	
	staticFunctions.DURATION = "duration";
	staticFunctions.FRAME_RATE = "frameRate";
	
	staticFunctions.START_TIME = "startTime";
	staticFunctions.END_TIME = "endTime";
});