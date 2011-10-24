dbm.registerClass("com.developedbyme.core.globalobjects.audiomanager.mixer.Mixer", "com.developedbyme.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.audiomanager.mixer.Mixer");
	
	var Mixer = dbm.importClass("com.developedbyme.core.globalobjects.audiomanager.mixer.Mixer");
	
	var MixerChannel = dbm.importClass("com.developedbyme.core.globalobjects.audiomanager.mixer.MixerChannel");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.audiomanager.mixer.Mixer::init");
		
		this.superCall();
		
		this._masterChannel = null;
		this._channels = new Array();
		
		return this;
	};
	
	objectFunctions.setMasterChannel = function(aChannel) {
		//console.log("com.developedbyme.core.globalobjects.audiomanager.mixer.Mixer::setMasterChannel");
		
		this._masterChannel = aChannel;
	};
	
	objectFunctions.getMasterChannel = function() {
		//console.log("com.developedbyme.core.globalobjects.audiomanager.mixer.Mixer::getMasterChannel");
		
		return this._masterChannel;
	};
	
	objectFunctions.addChannel = function(aChannel) {
		//console.log("com.developedbyme.core.globalobjects.audiomanager.mixer.Mixer::addChannel");
		
		aChannel.getProperty("masterInput").connectInput(this._masterChannel.getProperty("output"));
		this._channels.push(aChannel);
	};
	
	objectFunctions.createChannel = function(aName, aInput) {
		//console.log("com.developedbyme.core.globalobjects.audiomanager.mixer.Mixer::createChannel");
		var newChannel = MixerChannel.create(null, aInput);
		if(aName != null) {
			newChannel.setName(aName);
		}
		this.addChannel(newChannel);
	};
	
	objectFunctions.createMixer = function() {
		//console.log("com.developedbyme.core.globalobjects.audiomanager.mixer.Mixer::createMixer");
		var newMixer = Mixer.create();
		this.addChannel(newMixer.getMasterChannel());
		return newMixer;
	};
	
	/**
	 * Sets all the references to null
	 */
	objectFunctions.setAllReferencesToNull = function() {
		
		this._masterChannel = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function(aMasterChannel) {
		var newMixer = (new ClassReference()).init();
		if(aMasterChannel != null) {
			newMixer.setMasterChannel(aMasterChannel);
		}
		else {
			newMixer.setMasterChannel(MixerChannel.create());
		}
		return newMixer;
	};
});