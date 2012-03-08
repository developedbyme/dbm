dbm.registerClass("com.developedbyme.core.globalobjects.audiomanager.audio.PlayingAudio", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.audiomanager.audio.PlayingAudio");
	
	var PlayingAudio = dbm.importClass("com.developedbyme.core.globalobjects.audiomanager.audio.PlayingAudio");
	
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	var ExternalVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalVariableProperty");
	
	var AudioEventIds = dbm.importClass("com.developedbyme.constants.htmlevents.AudioEventIds");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.audiomanager.audio.PlayingAudio::_init");
		
		this.superCall();
		
		this._name = null;
		this._element = null;
		this._mixerChannel = null;
		this._isPlaying = false;
		
		this._volume = this.createProperty("volume", 1);
		this._loop = this.createProperty("loop", false);
		
		this._outputVolume = null;
		
		this.getExtendedEvent().createEvent(AudioEventIds.CAN_PLAY);
		this.getExtendedEvent().addCommandToEvent(AudioEventIds.CAN_PLAY, CallFunctionCommand.createCommand(this, this._performPlay, []));
		
		return this;
	};
	
	objectFunctions.getName = function(aName, aElement, aMixerChannel) {
		
		return this._name;
	};
	
	objectFunctions.setup = function(aName, aElement, aMixerChannel) {
		
		this._name = aName;
		this._element = aElement;
		this._mixerChannel = aMixerChannel;
		this.addDestroyableObject(this._mixerChannel);
		
		this._outputVolume = this.addProperty("outputVolume", ExternalVariableProperty.create(this._objectProperty, this._element, "volume"));
		this._outputVolume.setValue(0);
		this._outputVolume.connectInput(this._mixerChannel.getProperty("output"));
		this._outputVolume.startUpdating();
		
		this._mixerChannel.setPropertyInput("input", this._volume);
		
		this.getExtendedEvent().linkJavascriptEvent(this._element, AudioEventIds.CAN_PLAY, AudioEventIds.CAN_PLAY, AudioEventIds.CAN_PLAY, true);
		
		return this;
	};
	
	objectFunctions.getElement = function() {
		return this._element;
	};
	
	objectFunctions.play = function() {
		
		this._isPlaying = true;
		
		this._outputVolume.update();
		
		if(this._element.readyState != 0) {
			this._performPlay();
		}
		else {
			this.getExtendedEvent().activateJavascriptEventLink(AudioEventIds.CAN_PLAY);
		}
		
		dbm.singletons.dbmUpdateManager.addUpdater(this, "updateInput");
		
		return this;
	};
	
	objectFunctions._performPlay = function() {
		//console.log("com.developedbyme.core.globalobjects.audiomanager.audio.PlayingAudio::_performPlay");
		
		if(this._isPlaying) {
			if(this._element.readyState != 0) {
				this._element.currentTime = 0;
				this._element.play();
			}
		}
		this.getExtendedEvent().deactivateJavascriptEventLink(AudioEventIds.CAN_PLAY);
	}
	
	objectFunctions.pause = function() {
		//console.log("com.developedbyme.core.globalobjects.audiomanager.audio.PlayingAudio::pause");
		
		this._isPlaying = false;
		
		this._element.pause();
		
		dbm.singletons.dbmUpdateManager.removeUpdater(this, "updateInput");
		
		return this;
	};
	
	objectFunctions.stop = function() {
		//console.log("com.developedbyme.core.globalobjects.audiomanager.audio.PlayingAudio::stop");
		
		this._isPlaying = false;
		
		this._element.pause();
		this._element.currentTime = 0;
		
		dbm.singletons.dbmUpdateManager.removeUpdater(this, "updateInput");
		
		return this;
	};
	
	objectFunctions.updateTime = function(aTime, aFrame) {
		//console.log("com.developedbyme.core.globalobjects.audiomanager.audio.PlayingAudio::updateTime");
		
		var playbackTime = this._element.currentTime;
		
		//console.log(playbackTime);
		
		if(playbackTime >= this._element.duration) {
			if(this._loop.getValue()) {
				this._element.currentTime = 0;
				if(this._element.paused) {
					this._element.play();
				}
			}
			else {
				this.stop();
			}
		}
	};
	
	objectFunctions.performDestroy = function() {
		
		if(this._element != null && this._isPlaying) {
			this._element.pause();
			dbm.singletons.dbmUpdateManager.removeUpdater(this, "updateInput");
		}
		dbm.singletons.dbmAudioManager._linkRegistration_removePlayingAudio(this);
		
		this.superCall();
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._element = null;
		this._mixerChannel = null;
		
		this._volume = null;
		this._loop = null;
		this._outputVolume = null;
		this._mixerChannel = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aName, aElement, aMixerChannel) {
		var newPlayingAudio = (new ClassReference()).init();
		newPlayingAudio.setup(aName, aElement, aMixerChannel);
		return newPlayingAudio;
	};
});