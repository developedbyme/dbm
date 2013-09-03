dbm.registerClass("com.developedbyme.core.extendedevent.commands.audio.PlayAudioCommand", "com.developedbyme.core.extendedevent.commands.CommandBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.extendedevent.commands.audio.PlayAudioCommand");
	
	var PlayAudioCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.audio.PlayAudioCommand");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var CommandStatusTypes = dbm.importClass("com.developedbyme.constants.CommandStatusTypes");
	
	var StaticVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.staticreevaluation.StaticVariableObject");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.extendedevent.commands.audio.PlayAudioCommand::_init");
		
		this.superCall();
		
		this.idReevaluator = null;
		this.loopReevaluator = null;
		this.volumeReevaluator = null;
		this.mixerNameReevaluator = null;
		
		return this;
	};
	
	objectFunctions.perform = function(aEventDataObject) {
		//console.log("com.developedbyme.core.extendedevent.commands.audio.PlayAudioCommand::perform");
		//console.log(aEventDataObject);
		
		var audioId = this.idReevaluator.reevaluate(aEventDataObject);
		var loop = this.loopReevaluator.reevaluate(aEventDataObject);
		var volume = this.volumeReevaluator.reevaluate(aEventDataObject);
		var mixerName = this.mixerNameReevaluator.reevaluate(aEventDataObject);
		
		aEventDataObject.addResult(dbm.singletons.dbmAudioManager.playAudio(audioId, volume, loop, mixerName));
		
		return CommandStatusTypes.CONTINUE;
	};
	
	
	objectFunctions.performDestroy = function() {
		
		ClassReference.softDestroyIfExists(this.idReevaluator);
		ClassReference.softDestroyIfExists(this.loopReevaluator);
		ClassReference.softDestroyIfExists(this.volumeReevaluator);
		ClassReference.softDestroyIfExists(this.mixerNameReevaluator);
		
		this.superCall();
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		
		this.idReevaluator = null;
		this.loopReevaluator = null;
		this.volumeReevaluator = null;
		this.mixerNameReevaluator = null;
		
		this.superCall();
	};
	
	staticFunctions.createCommand = function(aAudioId, aVolume, aLoop, aMixerName) {
		
		aVolume = VariableAliases.valueWithDefault(aVolume, 1);
		aLoop = VariableAliases.valueWithDefault(aLoop, false);
		aMixerName = VariableAliases.valueWithDefault(aMixerName, "audio");
		
		var newCommand = (new PlayAudioCommand()).init();
		
		newCommand.idReevaluator = StaticVariableObject.createReevaluationObject(aAudioId);
		newCommand.volumeReevaluator = StaticVariableObject.createReevaluationObject(aVolume);
		newCommand.loopReevaluator = StaticVariableObject.createReevaluationObject(aLoop);
		newCommand.mixerNameReevaluator = StaticVariableObject.createReevaluationObject(aMixerName);
		
		return newCommand;
	};
});