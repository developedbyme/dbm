dbm.registerClass("com.developedbyme.gui.media.MediaElementBaseObject", "com.developedbyme.gui.DisplayBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.gui.media.MediaElementBaseObject");
	
	var MediaElementBaseObject = dbm.importClass("com.developedbyme.gui.media.MediaElementBaseObject");
	
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
	var AudioEventIds = dbm.importClass("com.developedbyme.constants.htmlevents.AudioEventIds");
	var PlaybackExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.PlaybackExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.gui.media.MediaElementBaseObject::_init");
		
		this.superCall();
		
		this._urls = null;
		this._selectedUrl = null;
		this._maxTimeDifference = 1;
		
		this._stateTimeline = Timeline.create(PlaybackStateTypes.PAUSED);
		this.addDestroyableObject(this._stateTimeline);
		this._startTimeTimeline = Timeline.create(0);
		this.addDestroyableObject(this._startTimeTimeline);
		this._startPositionTimeline = Timeline.create(0);
		this.addDestroyableObject(this._startPositionTimeline);
		this._currentTime = this.createProperty("currentTime", 0);
		this._playbackState = this.createProperty("playbackState", PlaybackStateTypes.PLAYING);
		this._playbackSpeed = this.createProperty("playbackSpeed", 1);
		
		this._mixerChannel = null;
		this._createMixerChannel();
		
		this._volume = this.createProperty("volume", 1);
		this._outputVolume = this.addProperty("outputVolume", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null));
		this._mixerChannel.setPropertyInput("input", this._volume);
		this._outputVolume.connectInput(this._mixerChannel.getProperty("output"));
		this._muted = this.addProperty("muted", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, false));
		
		this._outputTime = this.createProperty("outputTime", 0);
		
		this._playback = this.createGhostProperty("playback");
		this._updateFunctions.getObject("display").addInputConnection(this._playback);
		
		this._hasEnded = this.createProperty("hasEnded", false);
		this._loop = this.createProperty("loop", false);
		this._loopPlayback = this.addProperty("loopPlayback", ExternalVariableProperty.createWithoutExternalObject(this._objectProperty, null)); //MENOTE: since firefox doesn't suppert the loop attribute yet this needs to be linked
		this._loopPlayback.connectInput(this._loop);
		
		this.createUpdateFunction("default", this._updateFlow, [this._stateTimeline.getProperty("outputValue"), this._startTimeTimeline.getProperty("outputValue"), this._startPositionTimeline.getProperty("outputValue"), this._currentTime, this._playbackState, this._playbackSpeed, this._outputVolume, this._loop, this._loopPlayback], [this._outputTime, this._playback, this._hasEnded]);
		
		this.getExtendedEvent().addCommandToEvent(VideoEventIds.VOLUME_CHANGE, SetPropertyAsDirtyCommand.createCommand(this._muted));
		this.getExtendedEvent().addCommandToEvent(VideoEventIds.LOADED_META_DATA, CallFunctionCommand.createCommand(this, this._metaDataLoaded, [GetVariableObject.createSelectDataCommand()]));
		
		return this;
	};
	
	objectFunctions._createMixerChannelOfType = function(aType) {
		this._mixerChannel = dbm.singletons.dbmAudioManager.getMixer(aType).createChannel(null, 1);
		this.addDestroyableObject(this._mixerChannel);
	};
	
	objectFunctions._createMixerChannel = function() {
		this._createMixerChannelOfType("general");
		//MENOTE: should be overridden
	};
	
	objectFunctions.setElement = function(aElement) {
		
		this.superCall(aElement);
		
		this._outputVolume.setupExternalObject(this.getElement(), "volume");
		this._muted.setupExternalObject(this.getElement(), "muted");
		this._loopPlayback.setupExternalObject(this.getElement(), "loop");
		
		this.getExtendedEvent().linkJavascriptEvent(aElement, AudioEventIds.LOADED_META_DATA, AudioEventIds.LOADED_META_DATA, AudioEventIds.LOADED_META_DATA, true).activate();
		
		return this;
	};
	
	objectFunctions.reactivateForNewDocument = function() {
		this.superCall();
		
		var currentElement = this.getElement();
		
		if(currentElement !== null) {
			var asset = dbm.singletons.dbmAssetRepository.getAsset(this._selectedUrl);
			var videoTag = asset.getData();
			var newVideoTag = currentElement.ownerDocument.importNode(videoTag, true);
			newVideoTag.load();
			dbm.singletons.dbmHtmlDomManager.copyStyle(currentElement, newVideoTag);
			
			this.setElement(newVideoTag);
			//this.getProperty("display").update();
		}
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
	
	objectFunctions._metaDataLoaded = function(aEvent) {
		if(this.getExtendedEvent().hasEvent(PlaybackExtendedEventIds.META_DATA_LOADED)) {
			this.getExtendedEvent().perform(PlaybackExtendedEventIds.META_DATA_LOADED);
		}
	};
	
	objectFunctions.setUrls = function(aUrls, aPreload) {
		
		this._urls = aUrls;
		
		var isSelected = false;
		var maybeUrl = null;
		
		var currentArray = aUrls;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentUrl = currentArray[i];
			var currentType = this._getTypeForUrl(currentUrl);
			var canPlayStatus = this.getElement().canPlayType(currentType);
			//console.log(currentType, canPlayStatus);
			if(canPlayStatus === "probably") {
				if(this.getElement().src === null) {
					this.getElement().src = currentUrl;
				}
				this._selectedUrl = currentUrl;
				isSelected = true;
				break;
			}
			else if(maybeUrl === null) {
				if(canPlayStatus === "maybe") {
					maybeUrl = currentUrl;
				}
				else {
					var currentTypeWithoutCodecs = this._getTypeWithoutCodecsForUrl(currentUrl);
					var canPlayStatus = this.getElement().canPlayType(currentTypeWithoutCodecs);
					//console.log(currentTypeWithoutCodecs, canPlayStatus);
					if(canPlayStatus === "probably" || canPlayStatus === "maybe") {
						maybeUrl = currentUrl;
					}
				}
			}
		}
		if(!isSelected && maybeUrl !== null) {
			if(this.getElement().src === null) {
				this.getElement().src = maybeUrl;
			}
			this._selectedUrl = maybeUrl;
		}
		if(aPreload) {
			this.getElement().load();
		}
	};
	
	objectFunctions.setUrl = function(aUrl, aPreload) {
		this.getElement().src = aUrl;
		this._selectedUrl = aUrl;
		if(aPreload) {
			this.getElement().load();
		}
	};
	
	objectFunctions.play = function() {
		
		var currentState = this._stateTimeline.getValue();
		if(currentState === PlaybackStateTypes.PLAYING) {
			return;
		}
		
		this._stateTimeline.setValue(PlaybackStateTypes.PLAYING);
		this._startTimeTimeline.setValue(this._currentTime.getValue());
		this._startPositionTimeline.setValue(this.getElement().currentTime);
		
		var playbackState = this._playbackState.getValue();
		var playbackSpeed = this._playbackSpeed.getValue();
		if(playbackState === PlaybackStateTypes.PLAYING && playbackSpeed === 1 && this.getElement().paused) {
			this._performPlay();
		}
	};
	
	objectFunctions.pause = function() {
		
		var currentState = this._stateTimeline.getValue();
		if(currentState === PlaybackStateTypes.PAUSED) {
			return;
		}
		
		this._stateTimeline.setValue(PlaybackStateTypes.PAUSED);
		this._startTimeTimeline.setValue(this._currentTime.getValue());
		this._startPositionTimeline.setValue(this.getElement().currentTime);
		
		if(!this.getElement().paused) {
			this._performPause();
		}
	};
	
	objectFunctions.seek = function(aTime) {
		
		this._startTimeTimeline.setValue(this._currentTime.getValue());
		this._startPositionTimeline.setValue(aTime);
		
		this._performSeek(aTime);
		this._outputTime.setValue(this.getElement().currentTime);
	};
	
	objectFunctions._performPlay = function() {
		try {
			this._outputVolume.update();
			this.getElement().play();
		}
		catch(theError) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_performPlay", "Media " + this._selectedUrl + " has an error.");
			ErrorManager.getInstance().reportError(this, "_performPlay", theError);
		}
	};
	
	objectFunctions._performPause = function() {
		try {
			if(this.getElement().ended) {
				//MENOTE: Get a grip firefox and learn how to pause an ended video
				this.getElement().currentTime = 0;
			}
			this.getElement().pause();
		}
		catch(theError) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_performPause", "Media " + this._selectedUrl + " has an error.");
			ErrorManager.getInstance().reportError(this, "_performPause", theError);
		}
	};
	
	objectFunctions._performSeek = function(aTime) {
		try {
			if(aTime >= 0 && aTime <= this.getElement().duration) {
				this.getElement().currentTime = aTime;
			}
		}
		catch(theError) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "_perfomSeek", "Media " + this._selectedUrl + " has an error.");
			ErrorManager.getInstance().reportError(this, "_perfomSeek", theError);
		}
	};
	
	objectFunctions.setStateAt = function(aState, aOutputTime, aTime) {
		if(aState === PlaybackStateTypes.PAUSED) {
			if(this._stateTimeline.getValueAt(aTime) !== PlaybackStateTypes.PAUSED) {
				this._stateTimeline.setValueAt(PlaybackStateTypes.PAUSED, aTime);
			}
			this._startPositionTimeline.setValueAt(aOutputTime, aTime);
		}
		else {
			if(this._stateTimeline.getValueAt(aTime) !== PlaybackStateTypes.PLAYING) {
				this._stateTimeline.setValueAt(PlaybackStateTypes.PLAYING, aTime);
			}
			this._startTimeTimeline.setValueAt(aTime, aTime);
			this._startPositionTimeline.setValueAt(aOutputTime, aTime);
		}
	};
	
	objectFunctions.startScrubbing = function(aValue) {
		this.seek(aValue);
	};
	
	objectFunctions.updateScrubbing = function(aValue) {
		if(!this.getElement().seeking) {
			this.seek(aValue);
		}
	};
	
	objectFunctions.stopScrubbing = function(aValue) {
		this.seek(aValue);
	};
	
	objectFunctions._updateFlow = function(aFlowUpdateNumber) {
		
		if(this.getElement().seeking) {
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
			var loop = this._loop.getValueWithoutFlow();
			
			var timeShouldBeAt = (currentTime-startTime+startPosition);
			
			if(timeShouldBeAt >= this.getElement().duration) {
				if(loop) {
					var times = Math.floor(timeShouldBeAt/this.getElement().duration);
					timeShouldBeAt -= times*this.getElement().duration;
				}
			}
			
			this._hasEnded.setValueWithFlow(timeShouldBeAt >= this.getElement().duration);
			
			var maxTime;
			if(!isNaN(this.getElement().duration)) {
				maxTime = Math.max(0, Math.min(this.getElement().duration, timeShouldBeAt));
			}
			else {
				maxTime = Math.max(0, timeShouldBeAt);
			}
			
			var isPaused = this.getElement().paused;
			var hasEnded = this.getElement().ended;
			
			//console.log(this._selectedUrl, isPaused, hasEnded, maxTime, this.getElement().currentTime, state, startTime, startPosition, currentTime, playbackState, playbackSpeed);
			
			if((!isPaused) && (playbackState !== PlaybackStateTypes.PLAYING || playbackSpeed !== 1 || state === PlaybackStateTypes.PAUSED)) {
				this._performPause();
				isPaused = true;
			}
			
			if(isPaused) {
				if(state === PlaybackStateTypes.PLAYING && playbackState === PlaybackStateTypes.PLAYING && playbackSpeed === 1) {
					if(this.getElement().currentTime !== maxTime) {
						var timeDifference = Math.abs(maxTime-this.getElement().currentTime);
						if(timeDifference > this._maxTimeDifference && this.getElement().currentTime-timeDifference < this.getElement().duration) {
							//console.log(this.getElement().currentTime, maxTime, this.getElement().duration, timeShouldBeAt);
							this._performSeek(maxTime);
						}
						this._performPlay();
						//console.log("play", this._selectedUrl, maxTime);
						this._outputTime.setValueWithFlow(maxTime, aFlowUpdateNumber);
					}
				}
				else {
					if(state !== PlaybackStateTypes.PAUSED) {
						if(this.getElement().currentTime !== maxTime) {
							this._performSeek(maxTime);
							//console.log("update", this._selectedUrl, maxTime);
							this._outputTime.setValueWithFlow(maxTime, aFlowUpdateNumber);
						}
						else {
							//console.log("else2", this._selectedUrl, this.getElement().currentTime);
						}
					}
					else {
						//console.log("else", this._selectedUrl, this.getElement().currentTime);
						if(this.getElement().currentTime !== startPosition) {
							if(this.getElement().networkState === this.getElement().NETWORK_IDLE || this.getElement().networkState === this.getElement().NETWORK_LOADING) {
								//console.log("else", this._selectedUrl, this.getElement().currentTime, startPosition);
								this._performSeek(startPosition);
							}
						}
						this._outputTime.setValueWithFlow(this.getElement().currentTime, aFlowUpdateNumber);
					}
				}
			}
			else {
				var timeDifference = Math.abs(maxTime-this.getElement().currentTime);
				if(timeDifference > this._maxTimeDifference && this.getElement().currentTime-timeDifference < this.getElement().duration) {
					//console.log("timeDifference", timeDifference);
					this._performSeek(maxTime);
					//console.log("timeDiff", this._selectedUrl, maxTime);
				}
				this._outputTime.setValueWithFlow(maxTime, aFlowUpdateNumber);
			}
		}
	};
	
	objectFunctions.resetAllPlayback = function() {
		this._stateTimeline.clear();
		this._startPositionTimeline.clear();
		this._startTimeTimeline.clear();
		
		try {
			this.getElement().currentTime = 0;
		}
		catch(theError) {
			ErrorManager.getInstance().report(ReportTypes.ERROR, ReportLevelTypes.NORMAL, this, "resetAllPlayback", "Media " + this._selectedUrl + " has an error.");
			ErrorManager.getInstance().reportError(this, "resetAllPlayback", theError);
		}
		this._performPause();
	};
	
	objectFunctions._getTypeForUrl = function(aUrl) {
		//MENOTE: should be overridden
		return "unknown";
	};
	
	objectFunctions._getTypeWithoutCodecsForUrl = function(aUrl) {
		//MENOTE: should be overridden
		return "unknown";
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
		this._mixerChannel = null;
		this._outputVolume = null;
		this._volume = null;
		this._muted = null;
		
		this._hasEnded = null;
		this._loop = null;
		this._loopPlayback = null;
		
		this.superCall();
	};
	
	staticFunctions._create = function(aClass, aElementType, aParentOrDocument, aAddToParent, aUrls, aPreload, aAttributes) {
		var newNode = ClassReference._createAndInitClass();
		
		var theDocument = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument : aParentOrDocument.ownerDocument;
		var theParent = (aParentOrDocument.nodeType === XmlNodeTypes.DOCUMENT_NODE) ? aParentOrDocument.body : aParentOrDocument;
		
		var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(theDocument);
		
		newNode.setElement(htmlCreator.createNode(aElementType, aAttributes));
		newNode.setUrls(aUrls, aPreload);
		newNode.setParent(theParent);
		if(aAddToParent !== false) {
			newNode.addToDom();
		}
		
		return newNode;
	};
});