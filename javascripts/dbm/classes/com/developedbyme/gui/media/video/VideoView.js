/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.gui.media.video.VideoView", "com.developedbyme.gui.media.MediaElementBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.gui.media.video.VideoView");
	//"use strict";
	
	//Self reference
	var VideoView = dbm.importClass("com.developedbyme.gui.media.video.VideoView");
	
	//Error report
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	//Dependencies
	var Timeline = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline");
	var SetPropertyAsDirtyCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.SetPropertyAsDirtyCommand");
	var ExternalVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalVariableProperty");
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	//Utils
	var PathFunctions = dbm.importClass("com.developedbyme.utils.file.PathFunctions");
	
	//Constants
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	var PlaybackStateTypes = dbm.importClass("com.developedbyme.constants.PlaybackStateTypes");
	var VideoEventIds = dbm.importClass("com.developedbyme.constants.htmlevents.VideoEventIds");
	var PlaybackExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.PlaybackExtendedEventIds");
	var AssetStatusTypes = dbm.importClass("com.developedbyme.constants.AssetStatusTypes");
	
	/**
	 * Constructor
	 */
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.media.video.VideoView::_init");
		
		this.superCall();
		
		return this;
	};
	
	objectFunctions._createMixerChannel = function() {
		this._createMixerChannelOfType("video");
	};
	
	objectFunctions._getTypeForUrl = function(aUrl) {
		switch(PathFunctions.getFileExtension(aUrl).toLowerCase()) {
			case "mp4":
			case "m4v":
				return "video/mp4; codecs=\"avc1.42E01E, mp4a.40.2\"";
			case "ogv":
				return "video/ogg; codecs=\"theora, vorbis\"";
			case "webm":
				return "video/webm; codecs=\"vp8, vorbis\"";
		}
		
		return "unknown";
	};
	
	objectFunctions._getTypeWithoutCodecsForUrl = function(aUrl) {
		switch(PathFunctions.getFileExtension(aUrl).toLowerCase()) {
			case "mp4":
			case "m4v":
				return "video/mp4";
			case "ogv":
				return "video/ogg";
			case "webm":
				return "video/webm";
		}
		
		return "unknown";
	};
	
	staticFunctions.create = function(aParentOrDocument, aAddToParent, aUrls, aPreload, aAttributes) {
		return ClassReference._create(ClassReference, "video", aParentOrDocument, aAddToParent, aUrls, aPreload, aAttributes);
	};
	
	staticFunctions.createFromAsset = function(aParentOrDocument, aAddToParent, aAssetPath, aAttributes) {
		//console.log("com.developedbyme.gui.media.video.VideoView::createFromAsset");
		var newNode = (new ClassReference()).init();
		
		var theDocument = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(theDocument);
		
		var asset = dbm.singletons.dbmAssetRepository.getAsset(aAssetPath);
		
		if(asset.getStatus() === AssetStatusTypes.NOT_LOADED) {
			asset.load();
		}
		
		var videoTag = asset.getData();
		var newVideoTag = theDocument.importNode(videoTag, true);
		newVideoTag.load();
		
		dbm.singletons.dbmHtmlDomManager.setAttributesToNode(newVideoTag, aAttributes);
		
		newNode.setElement(newVideoTag);
		newNode.setUrls([aAssetPath], false);
		newNode.setParent(theParent);
		if(aAddToParent !== false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
});