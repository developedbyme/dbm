dbm.registerClass("com.developedbyme.utils.browser.FeatureCheck", null, function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.browser.FeatureCheck");
	
	var FeatureCheck = dbm.importClass("com.developedbyme.utils.browser.FeatureCheck");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	
	staticFunctions.DEFAULT_VIDEO_TYPES = ["video/mp4; codecs=\"avc1.42E01E, mp4a.40.2\"", "video/mp4", "video/ogg; codecs=\"theora, vorbis\"", "video/ogg", "video/webm; codecs=\"vp8, vorbis\"", "video/webm"];
	staticFunctions.DEFAULT_AUDIO_TYPES = ["audio/mpeg", "audio/ogg; codecs=\"vorbis\"", "audio/ogg"];
	
	staticFunctions.getSupportedVideoFormat = (function(aTestArray) {
		//console.log("com.developedbyme.utils.browser.FeatureCheck::getSupportedVideoFormat (static)");
		aTestArray = VariableAliases.valueWithDefault(aTestArray, ClassReference.DEFAULT_VIDEO_TYPES);
		//console.log(aTestArray);
		
		var maybeType = null;
		
		var testVideoElement = document.createElement("video");
		
		var currentArray = aTestArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentType = currentArray[i];
			var currentTypeStatus = testVideoElement.canPlayType(currentType);
			//console.log(currentTypeStatus, currentType);
			if(currentTypeStatus == "probably") {
				return currentType;
			}
			else if(maybeType == null && currentTypeStatus == "maybe") {
				maybeType = currentType;
			}
		}
		
		if(maybeType != null) {
			return maybeType;
		}
		
		//METODO: error message
		return null;
	});
	
	staticFunctions.getSupportedAudioFormat = (function(aTestArray) {
		//console.log("com.developedbyme.utils.browser.FeatureCheck::getSupportedAudioFormat (static)");
		aTestArray = VariableAliases.valueWithDefault(aTestArray, ClassReference.DEFAULT_AUDIO_TYPES);
		//console.log(aTestArray);
		
		var maybeType = null;
		
		var testVideoElement = document.createElement("audio");
		
		var currentArray = aTestArray;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentType = currentArray[i];
			var currentTypeStatus = testVideoElement.canPlayType(currentType);
			//console.log(currentTypeStatus, currentType);
			if(currentTypeStatus == "probably") {
				return currentType;
			}
			else if(maybeType == null && currentTypeStatus == "maybe") {
				maybeType = currentType;
			}
		}
		
		if(maybeType != null) {
			return maybeType;
		}
		
		//METODO: error message
		return null;
	});
});