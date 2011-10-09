dbm.registerClass("com.developedbyme.utils.audio.AudioPlayer", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.audio.AudioPlayer");
	
	var AudioPlayer = dbm.importClass("com.developedbyme.utils.audio.AudioPlayer");
	
	var Timeline = dbm.importClass("com.developedbyme.core.globalobjects.animationmanager.timeline.Timeline");
	
	var SetPropertyAsDirtyCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.SetPropertyAsDirtyCommand");
	
	var PathFunctions = dbm.importClass("com.developedbyme.utils.file.PathFunctions");
	
	var XmlNodeTypes = dbm.importClass("com.developedbyme.constants.XmlNodeTypes");
	var PlaybackStateTypes = dbm.importClass("com.developedbyme.constants.PlaybackStateTypes");
	var AudioEventIds = dbm.importClass("com.developedbyme.constants.htmlevents.AudioEventIds");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.audio.AudioPlayer::init");
		
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
		
		this._volume = this.addProperty("volume", ExternalVariableProperty.createWithoutExternalObject(this, null));
		this._muted = this.addProperty("muted", ExternalVariableProperty.createWithoutExternalObject(this, false));
		
		this._outputTime = this.createProperty("outputTime", 0);
		
		this._playback = this.createGhostProperty("playback");
		
		this.createUpdateFunction("default", this._updateFlow, [this._stateTimeline.getProperty("outputValue"), this._startTimeTimeline.getProperty("outputValue"), this._startPositionTimeline.getProperty("outputValue"), this._currentTime, this._playbackState, this._playbackSpeed], [this._outputTime, this._playback]);
		
		this.getExtendedEvent().addCommandToEvent(AudioEventIds.VOLUME_CHANGED, SetPropertyAsDirtyCommand.createCommand(this._volume));
		this.getExtendedEvent().addCommandToEvent(AudioEventIds.VOLUME_CHANGED, SetPropertyAsDirtyCommand.createCommand(this._muted));
		
		return this;
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this.superCall(aElement);
		
		this._volume.setupExternalObject(this._htmlElement, "volume");
		this._muted.setupExternalObject(this._htmlElement, "muted");
		
		this.getExtendedEvent().linkJavascriptEvent(aElement, AudioEventIds.VOLUME_CHANGED, AudioEventIds.VOLUME_CHANGED, AudioEventIds.VOLUME_CHANGED, true);
		
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
			this._htmlElement.play();
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
			this._htmlElement.pause();
		}
	};
	
	objectFunctions.seek = function(aTime) {
		//console.log("com.developedbyme.utils.audio.AudioPlayer::seek");
		
		this._startTimeTimeline.setValue(this._currentTime.getValue());
		this._startPositionTimeline.setValue(aTime);
		
		this._htmlElement.currentTime = aTime;
		this._outputTime.setValue(this._htmlElement.currentTime);
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
	
	objectFunctions.setUrls = function(aUrls, aPreload) {
		//console.log("com.developedbyme.utils.audio.AudioPlayer::setUrls");
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
		//console.log("com.developedbyme.utils.audio.AudioPlayer::_updateFlow");
		
		if(this._htmlElement.seeking) {
			//MENOTE: do nothing
			//console.log("seeking");
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
			
			if((!isPaused) && (playbackState != PlaybackStateTypes.PLAYING || playbackSpeed != 1 || state == PlaybackStateTypes.PAUSED)) {
				this._htmlElement.pause();
				isPaused = true;
			}
			
			if(isPaused) {
				if(state == PlaybackStateTypes.PLAYING && playbackState == PlaybackStateTypes.PLAYING && playbackSpeed == 1) {
					this._htmlElement.play();
					this._htmlElement.currentTime = maxTime;
					this._outputTime.setValueWithFlow(maxTime, aFlowUpdateNumber);
				}
				else {
					if(state != PlaybackStateTypes.PAUSED) {
						if(this._htmlElement.currentTime != maxTime) {
							this._htmlElement.currentTime = maxTime;
							this._outputTime.setValueWithFlow(maxTime, aFlowUpdateNumber);
						}
					}
					else {
						this._outputTime.setValueWithFlow(this._htmlElement.currentTime, aFlowUpdateNumber);
					}
				}
			}
			else {
				var timeDifference = Math.abs(maxTime-this._htmlElement.currentTime);
				if(timeDifference > this._maxTimeDifference) {
					//console.log("timeDifference", timeDifference);
					this._htmlElement.currentTime = maxTime;
				}
				this._outputTime.setValueWithFlow(maxTime, aFlowUpdateNumber);
			}
		}
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case AudioEventIds.VOLUME_CHANGED:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
		
		aReturnArray.push("url: " + this._selectedUrl);
	};
	
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