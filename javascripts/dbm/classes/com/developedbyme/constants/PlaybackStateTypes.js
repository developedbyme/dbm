/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.constants.PlaybackStateTypes", null, function(objectFunctions, staticFunctions) {
	//console.log("com.developedbyme.constants.PlaybackStateTypes");
	
	var PlaybackStateTypes = dbm.importClass("com.developedbyme.constants.PlaybackStateTypes");
	
	staticFunctions.PAUSED = 0;
	staticFunctions.PLAYING = 1;
	staticFunctions.SCRUBBING = 2;
	
});