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
		this._maxTimeDifference = 0.5;
		
		this._stateTimeline = Timeline.create("paused");
		this.addDestroyableObject(this._stateTimeline);
		this._startTimeTimeline = Timeline.create(0);
		this.addDestroyableObject(this._startTimeTimeline);
		this._startPositionTimeline = Timeline.create(0);
		this.addDestroyableObject(this._startPositionTimeline);
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
		
		var currentState = this._stateTimeline.getValue();
		if(currentState == "playing") {
			return;
		}
		
		this._stateTimeline.setValue("playing");
		this._startTimeTimeline.setValue(this._currentTime.getValue());
		this._startPositionTimeline.setValue(this._htmlElement.currentTime);
		
		var playbackState = this._playbackState.getValue();
		var playbackSpeed = this._playbackSpeed.getValue();
		if(playbackState == 1 && playbackSpeed == 1 && this._htmlElement.paused) {
			this._htmlElement.play();
		}
	};
	
	objectFunctions.pause = function() {
		
		var currentState = this._stateTimeline.getValue();
		if(currentState == "paused") {
			return;
		}
		
		this._stateTimeline.setValue("paused");
		this._startTimeTimeline.setValue(this._currentTime.getValue());
		this._startPositionTimeline.setValue(this._htmlElement.currentTime);
		
		if(!this._htmlElement.paused) {
			this._htmlElement.pause();
		}
	};
	
	objectFunctions.seek = function(aTime) {
		//console.log("com.developedbyme.gui.video.VideoView::seek");
		
		this._startTimeTimeline.setValue(this._currentTime.getValue());
		this._startPositionTimeline.setValue(aTime);
		
		this._htmlElement.currentTime = aTime;
	};
	
	objectFunctions._getTypeForUrl = function(aUrl) {
		switch(PathFunctions.getFileExtension(aUrl).toLowerCase()) {
			case "mp4":
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
				return "video/mp4";
			case "ogv":
				return "video/ogg";
			case "webm":
				return "video/webm";
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
			var canPlayStatus = this._htmlElement.canPlayType(currentType);
			//console.log(currentType, canPlayStatus);
			if(canPlayStatus == "probably") {
				this._htmlElement.src = currentUrl;
				this._selectedUrl = currentUrl;
				isSelected = true;
				break;
			}
			else if(maybeUrl == null) {
				if(canPlayStatus == "maybe") {
					maybeUrl = currentUrl;
				}
				else {
					var currentTypeWithoutCodecs = this._getTypeWithoutCodecsForUrl(currentUrl);
					var canPlayStatus = this._htmlElement.canPlayType(currentTypeWithoutCodecs);
					//console.log(currentTypeWithoutCodecs, canPlayStatus);
					if(canPlayStatus == "probably" || canPlayStatus == "maybe") {
						maybeUrl = currentUrl;
					}
				}
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
		//console.log("com.developedbyme.gui.video.VideoView::_updateFlow");
		
		if(this._htmlElement.seeking) {
			//MENOTE: do nothing
		}
		else {
		
			var state = this._stateTimeline.getProperty("outputValue").getValueWithoutFlow();
			var startTime = this._startTimeTimeline.getProperty("outputValue").getValueWithoutFlow();
			var startPosition = this._startPositionTimeline.getProperty("outputValue").getValueWithoutFlow();
			var currentTime = this._currentTime.getValueWithoutFlow();
			var playbackState = this._playbackState.getValueWithoutFlow();
			var playbackSpeed = this._playbackSpeed.getValueWithoutFlow();
			
			var timeShouldBeAt = (currentTime-startTime+startPosition);
			var maxTime = Math.max(0, Math.min(this._htmlElement.duration, timeShouldBeAt));
			
			var isPaused = this._htmlElement.paused;
			var hasEnded = this._htmlElement.ended;
			
			if((!isPaused) && (playbackState != 1 || playbackSpeed != 1 || state == "paused")) {
				this._htmlElement.pause();
				isPaused = true;
			}
			
			if(isPaused) {
				if(state == "playing" && playbackState == 1 && playbackSpeed == 1) {
					this._htmlElement.play();
					this._htmlElement.currentTime = maxTime;
				}
				else {
					if(state != "paused") {
						if(this._htmlElement.currentTime != maxTime) {
							this._htmlElement.currentTime = maxTime;
						}
					}
				}
			}
			else {
				//if(!hasEnded) {
					var timeDifference = Math.abs(maxTime-this._htmlElement.currentTime);
					if(timeDifference > this._maxTimeDifference) {
						this._htmlElement.currentTime = maxTime;
					}
				//}
			}
			
			//console.log(currentTime-startTime+startPosition, this._htmlElement.currentTime);
			//console.log((currentTime-startTime+startPosition)-this._htmlElement.currentTime);
			//console.log(this._htmlElement.seeking, this._htmlElement.paused, this._htmlElement.ended);
		}
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("url: " + this._selectedUrl);
	}
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this._urls = null;
		this._selectedUrl = null;
		
		this._stateTimeline = null;
		this._startTimeTimeline = null;
		this._startPositionTimeline = null;
		this._currentTime = null;
		this._playbackState = null;
		this._playbackSpeed = null;
		
		this._playback = null;
		
		this.superCall();
	};
	
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