/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.core.globalobjects.audiomanager.mixer.Mixer", "dbm.core.FlowBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.core.globalobjects.audiomanager.mixer.Mixer");
	
	var Mixer = dbm.importClass("dbm.core.globalobjects.audiomanager.mixer.Mixer");
	
	var MixerChannel = dbm.importClass("dbm.core.globalobjects.audiomanager.mixer.MixerChannel");
	var VariableAliases = dbm.importClass("dbm.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("dbm.core.globalobjects.audiomanager.mixer.Mixer::_init");
		
		this.superCall();
		
		this._masterChannel = null;
		this._channels = new Array();
		
		return this;
	};
	
	objectFunctions.setMasterChannel = function(aChannel) {
		//console.log("dbm.core.globalobjects.audiomanager.mixer.Mixer::setMasterChannel");
		
		this._masterChannel = aChannel;
	};
	
	objectFunctions.getMasterChannel = function() {
		//console.log("dbm.core.globalobjects.audiomanager.mixer.Mixer::getMasterChannel");
		
		return this._masterChannel;
	};
	
	objectFunctions.addChannel = function(aChannel) {
		//console.log("dbm.core.globalobjects.audiomanager.mixer.Mixer::addChannel");
		
		aChannel.getProperty("masterInput").connectInput(this._masterChannel.getProperty("output"));
		this._channels.push(aChannel);
	};
	
	objectFunctions.createChannel = function(aName, aInput) {
		//console.log("dbm.core.globalobjects.audiomanager.mixer.Mixer::createChannel");
		var newChannel = MixerChannel.create(null, aInput);
		if(VariableAliases.isSet(aName)) {
			newChannel.setName(aName);
		}
		this.addChannel(newChannel);
		return newChannel;
	};
	
	objectFunctions.createMixer = function(aName) {
		//console.log("dbm.core.globalobjects.audiomanager.mixer.Mixer::createMixer");
		var newMixer = Mixer.create();
		if(VariableAliases.isSet(aName)) {
			newMixer.getMasterChannel().setName(aName);
		}
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
		if(VariableAliases.isSet(aMasterChannel)) {
			newMixer.setMasterChannel(aMasterChannel);
		}
		else {
			newMixer.setMasterChannel(MixerChannel.create(1, 1));
		}
		return newMixer;
	};
});