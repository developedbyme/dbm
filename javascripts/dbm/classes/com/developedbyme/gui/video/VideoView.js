dbm.registerClass("com.developedbyme.gui.video.VideoView", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.BaseObject");
	
	var VideoView = dbm.importClass("com.developedbyme.gui.video.VideoView");
	var Timeline = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline");
	
	var PathFunctions = dbm.importClass("com.developedbyme.utils.file.PathFunctions");
	
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.gui.video.VideoView::init");
		
		this.superCall();
		
		this._urls = null;
		this._selectedUrl = null;
		
		this._stateTimeline = Timeline.create("paused");
		this._startTimeTimeline = Timeline.create(0);
		this._startPositionTimeline = Timeline.create(0);
		this._currentTime = this.createProperty("currentTime", 0);
		this._playbackState = this.createProperty("playbackState", 1);
		this._playbackSpeed = this.createProperty("playbackSpeed", 1);
		
		this._playback = this.createGhostProperty("playback");
		
		this.createUpdateFunction("default", this._updateFlow, [this._stateTimeline.getProperty("outputValue"), this._startTimeTimeline.getProperty("outputValue"), this._startPositionTimeline.getProperty("outputValue"), this._currentTime, this._playbackState, this._playbackSpeed], [this._playback]);
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this.superCall(aElement);
		
		//this.getExtendedEvent().linkJavascriptEvent(aElement, "click", ButtonExtendedEventIds.CLICK, ButtonExtendedEventIds.CLICK, true, true);
		
		return this;
	};
	
	objectFunctions.setPlaybackNode = function(aPlaybackNode) {
		this._stateTimeline.setPropertyInput("time", aPlaybackNode.getProperty("outputTime"));
		this._startTimeTimeline.setPropertyInput("time", aPlaybackNode.getProperty("outputTime"));
		this._startPositionTimeline.setPropertyInput("time", aPlaybackNode.getProperty("outputTime"));
		this._currentTime.connectInput(aPlaybackNode.getProperty("outputTime"));
		this._playbackSpeed.connectInput(aPlaybackNode.getProperty("playbackSpeed"));
		this._playbackState.connectInput(aPlaybackNode.getProperty("state"));
		
		this._playback.startUpdating();
	};
	
	objectFunctions.play = function() {
		this._htmlElement.play();
		this._stateTimeline.setValue("playing");
		this._startTimeTimeline.setValue(this._currentTime.getValue());
		this._startPositionTimeline.setValue(0);
	};
	
	objectFunctions.seek = function(aTime) {
		//console.log("com.developedbyme.gui.video.VideoView::seek");
		
		this._startTimeTimeline.setValue(this._currentTime.getValue());
		this._startPositionTimeline.setValue(aTime);
		
		this._htmlElement.currentTime = aTime;
	};
	
	objectFunctions._getTypeForUrl = function(aUrl) {
		switch(PathFunctions.getFileExtension(aUrl)) {
			case "mp4":
				return "video/mp4; codecs=\"avc1.42E01E, mp4a.40.2\"";
			case "ogv":
				return "video/ogg; codecs=\"theora, vorbis\"";
			case "webm":
				return "video/webm; codecs=\"vp8, vorbis\"";
		}
		
		return "unknown";
	};
	
	objectFunctions.setUrls = function(aUrls, aPreload) {
		//console.log("com.developedbyme.gui.video.VideoView::setUrls");
		this._urls = aUrls;
		
		var isSelected = false;
		var maybeUrl = null;
		
		var currentArray = aUrls;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentUrl = currentArray[i];
			var currentType = this._getTypeForUrl(currentUrl);
			//console.log(currentType, this._htmlElement.canPlayType(currentType));
			var canPlayStatus = this._htmlElement.canPlayType(currentType);
			if(canPlayStatus == "probably") {
				this._htmlElement.src = currentUrl;
				this._selectedUrl = currentUrl;
				isSelected = true;
				break;
			}
			else if(maybeUrl == null && canPlayStatus == "maybe") {
				maybeUrl = currentUrl;
			}
		}
		if(!isSelected && maybeUrl != null) {
			this._htmlElement.src = maybeUrl;
			this._selectedUrl = maybeUrl;
		}
		if(aPreload) {
			this._htmlElement.load();
		}
	}
	
	objectFunctions._updateFlow = function(aFlowUpdateNumber) {
		console.log("com.developedbyme.gui.video.VideoView::_updateFlow");
		
		var state = this._stateTimeline.getProperty("outputValue").getValueWithoutFlow();
		var startTime = this._startTimeTimeline.getProperty("outputValue").getValueWithoutFlow();
		var startPosition = this._startPositionTimeline.getProperty("outputValue").getValueWithoutFlow();
		var currentTime = this._currentTime.getValueWithoutFlow();
		var playbackState = this._playbackState.getValueWithoutFlow();
		var playbackSpeed = this._playbackSpeed.getValueWithoutFlow();
		
		//console.log(currentTime-startTime+startPosition, this._htmlElement.currentTime);
		console.log((currentTime-startTime+startPosition)-this._htmlElement.currentTime);
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("url: " + this._selectedUrl);
	}
	
	staticFunctions.create = function(aParentOrDocument, aAddToParent, aUrls, aPreload, aAttributes) {
		var newNode = (new ClassReference()).init();
		
		var theDocument = (aParentOrDocument.nodeType == XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType == XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(theDocument);
		
		newNode.setElement(htmlCreator.createNode("video", aAttributes));
		newNode.setUrls(aUrls, aPreload);
		newNode.setParent(theParent);
		if(aAddToParent != false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
});