dbm.registerClass("com.developedbyme.core.globalobjects.audiomanager.audio.PlayingAudio", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.audiomanager.audio.PlayingAudio");
	
	var PlayingAudio = dbm.importClass("com.developedbyme.core.globalobjects.audiomanager.audio.PlayingAudio");
	
	var ExternalVariableProperty = dbm.importClass("com.developedbyme.core.objectparts.ExternalVariableProperty");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.audiomanager.audio.PlayingAudio::init");
		
		this.superCall();
		
		this._name = null;
		this._element = null;
		this._mixerChannel = null;
		this._isPlaying = false;
		
		this._volume = this.createProperty("volume", 1);
		this._loop = this.createProperty("loop", false);
		
		this._outputVolume = null;
		
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
		
		return this;
	};
	
	objectFunctions.play = function() {
		
		this._isPlaying = true;
		
		this._outputVolume.update();
		this._element.play();
		
		dbm.singletons.dbmUpdateManager.addUpdater(this, "updateInput");
		
		return this;
	};
	
	objectFunctions.pause = function() {
		
		this._isPlaying = false;
		
		this._element.pause();
		
		dbm.singletons.dbmUpdateManager.removeUpdater(this, "updateInput");
		
		return this;
	};
	
	objectFunctions.stop = function() {
		
		this._isPlaying = false;
		
		this._element.pause();
		this._element.currentTime = 0;
		
		dbm.singletons.dbmUpdateManager.removeUpdater(this, "updateInput");
		
		return this;
	};
	
	objectFunctions.updateTime = function(aTime, aFrame) {
		//console.log("com.developedbyme.core.globalobjects.audiomanager.audio.PlayingAudio::updateTime");
		
		var playbackTime = this._element.currentTime;
		
		if(playbackTime >= this._element.duration && this._loop.getValue()) {
			this._element.currentTime = 0;
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