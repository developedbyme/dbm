/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.gui.media.audio.AudioPlayer", "com.developedbyme.gui.media.MediaElementBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.gui.media.audio.AudioPlayer");
	
	var AudioPlayer = dbm.importClass("com.developedbyme.gui.media.audio.AudioPlayer");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.media.audio.AudioPlayer::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._createMixerChannel = function() {
		this._createMixerChannelOfType("audio");
	};
	
	objectFunctions._getTypeForUrl = function(aUrl) {
		switch(PathFunctions.getFileExtension(aUrl).toLowerCase()) {
			case "aac":
				return "audio/aac";
			case "mp3":
				return "audio/mp3";
			case "mp4":
				return "audio/mp4";
			case "oga":
				return "audio/ogg; codecs=\"vorbis\"";
		}
		
		//METODO: fix codecs
		
		return "unknown";
	};
	
	objectFunctions._getTypeWithoutCodecsForUrl = function(aUrl) {
		switch(PathFunctions.getFileExtension(aUrl).toLowerCase()) {
			case "aac":
				return "audio/aac";
			case "mp3":
				return "audio/mp3";
			case "mp4":
				return "audio/mp4";
			case "oga":
				return "audio/ogg";
		}
		
		return "unknown";
	};
	
	staticFunctions.create = function(aParentOrDocument, aAddToParent, aUrls, aPreload, aAttributes) {
		return ClassReference._create(ClassReference, "audio", aParentOrDocument, aAddToParent, aUrls, aPreload, aAttributes);
	};
	
	staticFunctions.createWithNode = function(aNode) {
		var newNode = (new ClassReference()).init();
		
		newNode.setElement(aNode);
		
		return newNode;
	};
});