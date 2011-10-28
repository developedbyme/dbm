dbm.registerClass("com.developedbyme.gui.video.VideoView", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.gui.video.VideoView");
	
	var VideoView = dbm.importClass("com.developedbyme.gui.video.VideoView");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var Timeline = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline");
	
	var SetPropertyAsDirtyCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.SetPropertyAsDirtyCommand");
	var ExternalVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalVariableProperty");
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var PathFunctions = dbm.importClass("com.developedbyme.utils.file.PathFunctions");
	
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	var PlaybackStateTypes = dbm.importClass("com.developedbyme.constants.PlaybackStateTypes");
	var VideoEventIds = dbm.importClass("com.developedbyme.constants.htmlevents.VideoEventIds");
	var PlaybackExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.PlaybackExtendedEventIds");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.gui.video.VideoView::init");
		
		this.superCall();
		
		this._urls = null;
		this._selectedUrl = null;
		this._maxTimeDifference = 0.5;
		
		this._stateTimeline = Timeline.create(PlaybackStateTypes.PAUSED);
		this.addDestroyableObject(this._stateTimeline);
		this._startTimeTimeline = Timeline.create(0);
		this.addDestroyableObject(this._startTimeTimeline);
		this._startPositionTimeline = Timeline.create(0);
		this.addDestroyableObject(this._startPositionTimeline);
		this._currentTime = this.createProperty("currentTime", 0);
		this._playbackState = this.createProperty("playbackState", PlaybackStateTypes.PLAYING);
		this._playbackSpeed = this.createProperty("playbackSpeed", 1);
		
		this._volume = this.addProperty("volume", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._muted = this.addProperty("muted", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, false));
		
		this._outputTime = this.createProperty("outputTime", 0);
		
		this._playback = this.createGhostProperty("playback");
		
		this.createUpdateFunction("default", this._updateFlow, [this._stateTimeline.getProperty("outputValue"), this._startTimeTimeline.getProperty("outputValue"), this._startPositionTimeline.getProperty("outputValue"), this._currentTime, this._playbackState, this._playbackSpeed], [this._outputTime, this._playback]);
		
		this.getExtendedEvent().addCommandToEvent(VideoEventIds.VOLUME_CHANGE, SetPropertyAsDirtyCommand.createCommand(this._volume));
		this.getExtendedEvent().addCommandToEvent(VideoEventIds.VOLUME_CHANGE, SetPropertyAsDirtyCommand.createCommand(this._muted));
		this.getExtendedEvent().addCommandToEvent(VideoEventIds.LOADED_META_DATA, CallFunctionCommand.createCommand(this, this._metaDataLoaded, [GetVariableObject.createSelectDataCommand()]));
		
		//console.log(this);
		//console.log("//com.developedbyme.gui.video.VideoView::init");
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this.superCall(aElement);
		
		this._volume.setupExternalObject(this._htmlElement, "volume");
		this._muted.setupExternalObject(this._htmlElement, "muted");
		
		this.getExtendedEvent().linkJavascriptEvent(aElement, VideoEventIds.VOLUME_CHANGE, VideoEventIds.VOLUME_CHANGE, VideoEventIds.VOLUME_CHANGE, true).activate();
		this.getExtendedEvent().linkJavascriptEvent(aElement, VideoEventIds.LOADED_META_DATA, VideoEventIds.LOADED_META_DATA, VideoEventIds.LOADED_META_DATA, true).activate();
		
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
		if(currentState == PlaybackStateTypes.PLAYING) {
			return;
		}
		
		this._stateTimeline.setValue(PlaybackStateTypes.PLAYING);
		this._startTimeTimeline.setValue(this._currentTime.getValue());
		this._startPositionTimeline.setValue(this._htmlElement.currentTime);
		
		var playbackState = this._playbackState.getValue();
		var playbackSpeed = this._playbackSpeed.getValue();
		if(playbackState == PlaybackStateTypes.PLAYING && playbackSpeed == 1 && this._htmlElement.paused) {
			this._performPlay();
		}
	};
	
	objectFunctions.pause = function() {
		
		var currentState = this._stateTimeline.getValue();
		if(currentState == PlaybackStateTypes.PAUSED) {
			return;
		}
		
		this._stateTimeline.setValue(PlaybackStateTypes.PAUSED);
		this._startTimeTimeline.setValue(this._currentTime.getValue());
		this._startPositionTimeline.setValue(this._htmlElement.currentTime);
		
		if(!this._htmlElement.paused) {
			this._performPause();
		}
	};
	
	objectFunctions.seek = function(aTime) {
		//console.log("com.developedbyme.gui.video.VideoView::seek");
		
		this._startTimeTimeline.setValue(this._currentTime.getValue());
		this._startPositionTimeline.setValue(aTime);
		
		this._performSeek(aTime);
		this._outputTime.setValue(this._htmlElement.currentTime);
	};
	
	objectFunctions._performPlay = function() {
		try {
			this._htmlElement.play();
		}
		catch(theError) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_perfomSeek", "Video " + this._selectedUrl + " has an error.");
			ErrorManager.getInstance().reportError(this, "_perfomSeek", theError);
		}
	};
	
	objectFunctions._performPause = function() {
		try {
			this._htmlElement.pause();
		}
		catch(theError) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_perfomSeek", "Video " + this._selectedUrl + " has an error.");
			ErrorManager.getInstance().reportError(this, "_perfomSeek", theError);
		}
	};
	
	objectFunctions._performSeek = function(aTime) {
		//console.log("com.developedbyme.gui.video.VideoView::_performSeek");
		try {
			if(aTime >= 0 && aTime <= this._htmlElement.duration) {
				this._htmlElement.currentTime = aTime;
			}
		}
		catch(theError) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_perfomSeek", "Video " + this._selectedUrl + " has an error.");
			ErrorManager.getInstance().reportError(this, "_perfomSeek", theError);
		}
	};
	
	objectFunctions.setStateAt = function(aState, aOutputTime, aTime) {
		if(aState == PlaybackStateTypes.PAUSED) {
			if(this._stateTimeline.getValueAt(aTime) != PlaybackStateTypes.PAUSED) {
				this._stateTimeline.setValueAt(PlaybackStateTypes.PAUSED, aTime);
			}
			this._startPositionTimeline.setValueAt(aOutputTime, aTime);
		}
		else {
			if(this._stateTimeline.getValueAt(aTime) != PlaybackStateTypes.PLAYING) {
				this._stateTimeline.setValueAt(PlaybackStateTypes.PLAYING, aTime);
			}
			this._startTimeTimeline.setValueAt(aTime, aTime);
			this._startPositionTimeline.setValueAt(aOutputTime, aTime);
		}
	};
	
	objectFunctions.resetAllPlayback = function() {
		this._stateTimeline.clear();
		this._startPositionTimeline.clear();
		this._startTimeTimeline.clear();
	};
	
	objectFunctions._metaDataLoaded = function(aEvent) {
		//console.log("com.developedbyme.gui.video.VideoView::_metaDataLoaded");
		//console.log(this, this._selectedUrl, this._htmlElement.videoWidth, this._htmlElement.videoHeight);
		
		if(this.getExtendedEvent().hasEvent(PlaybackExtendedEventIds.META_DATA_LOADED)) {
			this.getExtendedEvent().perform(PlaybackExtendedEventIds.META_DATA_LOADED)
		}
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
	
	objectFunctions.startScrubbing = function(aValue) {
		this.seek(aValue);
	};
	
	objectFunctions.updateScrubbing = function(aValue) {
		if(!this._htmlElement.seeking) {
			this.seek(aValue);
		}
	};
	
	objectFunctions.stopScrubbing = function(aValue) {
		this.seek(aValue);
	};
	
	objectFunctions._updateFlow = function(aFlowUpdateNumber) {
		//console.log("com.developedbyme.gui.video.VideoView::_updateFlow");
		
		if(this._htmlElement.seeking) {
			//MENOTE: do nothing
			//console.log("seeking");
			if(this._selectedUrl == "assets/itemVideos/16_cog_push1.mp4") {
				console.log("seeking");
			}
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
			
			//console.log(this._selectedUrl, isPaused, hasEnded, maxTime, this._htmlElement.currentTime, state, startTime, startPosition, currentTime, playbackState, playbackSpeed);
			
			if((!isPaused) && (playbackState != PlaybackStateTypes.PLAYING || playbackSpeed != 1 || state == PlaybackStateTypes.PAUSED)) {
				this._performPause();
				isPaused = true;
			}
			
			if(isPaused) {
				if(state == PlaybackStateTypes.PLAYING && playbackState == PlaybackStateTypes.PLAYING && playbackSpeed == 1) {
					this._performPlay();
					this._performSeek(maxTime);
					//console.log("play", this._selectedUrl, maxTime);
					this._outputTime.setValueWithFlow(maxTime, aFlowUpdateNumber);
				}
				else {
					if(state != PlaybackStateTypes.PAUSED) {
						if(this._htmlElement.currentTime != maxTime) {
							this._performSeek(maxTime);
							//console.log("update", this._selectedUrl, maxTime);
							this._outputTime.setValueWithFlow(maxTime, aFlowUpdateNumber);
						}
						else {
							//console.log("else2", this._selectedUrl, this._htmlElement.currentTime);
						}
					}
					else {
						//console.log("else", this._selectedUrl, this._htmlElement.currentTime);
						if(this._htmlElement.currentTime != startPosition) {
							if(this._htmlElement.networkState == this._htmlElement.NETWORK_IDLE || this._htmlElement.networkState == this._htmlElement.NETWORK_LOADING) {
								//console.log("else", this._selectedUrl, this._htmlElement.currentTime, startPosition);
								this._performSeek(startPosition);
							}
						}
						this._outputTime.setValueWithFlow(this._htmlElement.currentTime, aFlowUpdateNumber);
					}
				}
			}
			else {
				var timeDifference = Math.abs(maxTime-this._htmlElement.currentTime);
				if(timeDifference > this._maxTimeDifference && this._htmlElement.currentTime-timeDifference < this._htmlElement.duration) {
					//console.log("timeDifference", timeDifference);
					this._performSeek(maxTime);
					//console.log("timeDiff", this._selectedUrl, maxTime);
				}
				this._outputTime.setValueWithFlow(maxTime, aFlowUpdateNumber);
			}
		}
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case VideoEventIds.VOLUME_CHANGE:
			case VideoEventIds.LOADED_META_DATA:
			case PlaybackExtendedEventIds.META_DATA_LOADED:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("url: " + this._selectedUrl);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("com.developedbyme.gui.video.VideoView::setAllReferencesToNull");
		
		this._urls = null;
		this._selectedUrl = null;
		
		this._stateTimeline = null;
		this._startTimeTimeline = null;
		this._startPositionTimeline = null;
		this._currentTime = null;
		this._playbackState = null;
		this._playbackSpeed = null;
		this._outputTime = null;
		
		this._playback = null;
		this._volume = null;
		this._muted = null;
		
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