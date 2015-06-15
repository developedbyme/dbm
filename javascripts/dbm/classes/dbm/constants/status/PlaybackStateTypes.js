/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.status.PlaybackStateTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.constants.status.PlaybackStateTypes");
	
	var PlaybackStateTypes = dbm.importClass("dbm.constants.status.PlaybackStateTypes");
	
	staticFunctions.PAUSED = 0;
	staticFunctions.PLAYING = 1;
	staticFunctions.SCRUBBING = 2;
	
	staticFunctions.NAME_ARRAY = ["paused", "playing", "scrubbing"];
	staticFunctions.NAME_ARRAY_OFFSET = 0;
	
	staticFunctions.getName = function(aValue) {
		return ClassReference.NAME_ARRAY[aValue+ClassReference.NAME_ARRAY_OFFSET];
	};
});