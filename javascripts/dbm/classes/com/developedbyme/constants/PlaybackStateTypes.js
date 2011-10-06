dbm.registerClass("com.developedbyme.constants.PlaybackStateTypes", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.PlaybackStateTypes");
	
	var PlaybackStateTypes = dbm.importClass("com.developedbyme.constants.PlaybackStateTypes");
	
	staticFunctions.PAUSED = 0;
	staticFunctions.PLAYING = 1;
	staticFunctions.SCRUBBING = 2;
	
});