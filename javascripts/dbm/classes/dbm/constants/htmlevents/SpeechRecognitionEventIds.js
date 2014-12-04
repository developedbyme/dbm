/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.constants.htmlevents.SpeechRecognitionEventIds", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.constants.htmlevents.SpeechRecognitionEventIds");
	
	var SpeechRecognitionEventIds = dbm.importClass("dbm.constants.htmlevents.SpeechRecognitionEventIds");
	
	staticFunctions.AUDIO_START = "audiostart"; //Fired when the user agent has started to capture audio.
	staticFunctions.SOUND_START = "soundstart"; //Fired when some sound, possibly speech, has been detected. This must be fired with low latency, e.g. by using a client-side energy detector.
	staticFunctions.SPEECH_START = "speechstart"; //Fired when the speech that will be used for speech recognition has started.
	staticFunctions.SPEECH_END = "speechend"; //Fired when the speech that will be used for speech recognition has ended. The speechstart event must always have been fire before speechend.
	staticFunctions.SOUND_END = "soundend"; //Fired when some sound is no longer detected. This must be fired with low latency, e.g. by using a client-side energy detector. The soundstart event must always have been fired before soundend.
	staticFunctions.AUDIO_END = "audioend"; //Fired when the user agent has finished capturing audio. The audiostart event must always have been fired before audioend.
	staticFunctions.RESULT = "result"; //Fired when the speech recognizer returns a result. The event must use the SpeechRecognitionEvent interface.
	staticFunctions.NO_MATCH = "nomatch"; //Fired when the speech recognizer returns a final result with no recognition hypothesis that meet or exceed the confidence threshold. The event must use the SpeechRecognitionEvent interface. The results attribute in the event may contain speech recognition results that are below the confidence threshold or may be null.
	staticFunctions.ERROR = "error"; //Fired when a speech recognition error occurs. The event must use the SpeechRecognitionError interface.
	staticFunctions.START = "start"; //Fired when the recognition service has begun to listen to the audio with the intention of recognizing.
	staticFunctions.END = "end"; //Fired when the service has disconnected. The event must always be generated when the session ends no matter the reason for the end.
	
});

