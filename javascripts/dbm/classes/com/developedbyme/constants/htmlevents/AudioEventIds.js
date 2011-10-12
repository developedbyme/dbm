dbm.registerClass("com.developedbyme.constants.htmlevents.AudioEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.constants.htmlevents.AudioEventIds");
	
	var AudioEventIds = dbm.importClass("com.developedbyme.constants.htmlevents.AudioEventIds");
	
	staticFunctions.LOAD_START = "loadstart";//The user agent begins looking for media data, as part of the resource selection algorithm.
	staticFunctions.PROGRESS = "progress";//The user agent is fetching media data.
	staticFunctions.SUSPEND = "suspend";//The user agent is intentionally not currently fetching media data, but does not have the entire media resource downloaded.
	staticFunctions.ABORT = "abort";//The user agent stops fetching the media data before it is completely downloaded, but not due to an error.
	staticFunctions.ERROR = "error";//An error occurs while fetching the media data.
	staticFunctions.EMPTIED = "emptied";//A media element whose networkState was previously not in the NETWORK_EMPTY state has just switched to that state (either because of a fatal error during load that's about to be reported, or because the load() method was invoked while the resource selection algorithm was already running).
	staticFunctions.STALLED = "stalled";//The user agent is trying to fetch media data, but data is unexpectedly not forthcoming.
	staticFunctions.PLAY = "play";//Playback has begun. Fired after the play() method has returned, or when the autoplay attribute has caused playback to begin.
	staticFunctions.PAUSE = "pause";//Playback has been paused. Fired after the pause() method has returned.
	staticFunctions.LOADED_META_DATA = "loadedmetadata";//The user agent has just determined the duration and dimensions of the media resource
	staticFunctions.LOADED_DATA = "loadeddata";//The user agent can render the media data at the current playback position for the first time.
	staticFunctions.WAITING = "waiting";//Playback has stopped because the next frame is not available, but the user agent expects that frame to become available in due course.
	staticFunctions.PLAYING = "playing";//Playback has started.
	staticFunctions.CAN_PLAY = "canplay";//The user agent can resume playback of the media data, but estimates that if playback were to be started now, the media resource could not be rendered at the current playback rate up to its end without having to stop for further buffering of content.
	staticFunctions.CAN_PLAY_THROUGH = "canplaythrough";//The user agent estimates that if playback were to be started now, the media resource could be rendered at the current playback rate all the way to its end without having to stop for further buffering.
	staticFunctions.SEEKING = "seeking";//The seeking IDL attribute changed to true and the seek operation is taking long enough that the user agent has time to fire the event.
	staticFunctions.SEEKED = "seeked";//The seeking IDL attribute changed to false.
	staticFunctions.TIME_UPDATE = "timeupdate";//The current playback position changed as part of normal playback or in an especially interesting way, for example discontinuously.
	staticFunctions.ENDED = "ended";//Playback has stopped because the end of the media resource was reached.
	staticFunctions.RATE_CHANGE = "ratechange";//Either the defaultPlaybackRate or the playbackRate attribute has just been updated.
	staticFunctions.DURATION_CHANGE = "durationchange";//The duration attribute has just been updated.
	staticFunctions.VOLUME_CHANGE = "volumechange";//Either the volume attribute or the muted attribute has changed. Fired after the relevant attribute's setter has returned.
});