/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("com.developedbyme.core.globalobjects.audiomanager.AudioManager", "com.developedbyme.core.globalobjects.GlobalObjectBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.core.globalobjects.audiomanager.AudioManager");
	
	var AudioManager = dbm.importClass("com.developedbyme.core.globalobjects.audiomanager.AudioManager");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	var CallFunctionCommand = dbm.importClass("com.developedbyme.core.extendedevent.commands.basic.CallFunctionCommand");
	var GetVariableObject = dbm.importClass("com.developedbyme.utils.reevaluation.objectreevaluation.GetVariableObject");
	
	var TreeStructure = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructure");
	var TreeStructureItem = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItem");
	var TreeStructureItemLink = dbm.importClass("com.developedbyme.utils.data.treestructure.TreeStructureItemLink");
	var Mixer = dbm.importClass("com.developedbyme.core.globalobjects.audiomanager.mixer.Mixer");
	var PlayingAudio = dbm.importClass("com.developedbyme.core.globalobjects.audiomanager.audio.PlayingAudio");
	var AudioPlayer = dbm.importClass("com.developedbyme.gui.media.audio.AudioPlayer");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var PathFunctions = dbm.importClass("com.developedbyme.utils.file.PathFunctions");
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	var AssetStatusTypes = dbm.importClass("com.developedbyme.constants.AssetStatusTypes");
	var LoadingExtendedEventIds = dbm.importClass("com.developedbyme.constants.extendedevents.LoadingExtendedEventIds");
	
	dbm.setClassAsSingleton("dbmAudioManager");
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.core.globalobjects.audiomanager.AudioManager::_init");
		
		this.superCall();
		
		this._mainMixer = Mixer.create();
		this._globalMasterChannel = this._mainMixer.getMasterChannel();
		
		this._mixers = NamedArray.create(false);
		this._mixers.addObject("master", this._mainMixer);
		
		var videoMixer = this._mainMixer.createMixer("video");
		this._mixers.addObject("video", videoMixer);
		
		var audioMixer = this._mainMixer.createMixer("audio");
		this._mixers.addObject("audio", audioMixer);
		
		var musicMixer = audioMixer.createMixer("music");
		this._mixers.addObject("music", musicMixer);
		
		var effectsMixer = audioMixer.createMixer("effects");
		this._mixers.addObject("effects", effectsMixer);
		
		this._playingAudio = new Array();
		
		return this;
	};
	
	objectFunctions.getGlobalMasterChannel = function() {
		//console.log("com.developedbyme.core.globalobjects.audiomanager.AudioManager::getGlobalMasterChannel");
		
		return this._globalMasterChannel;
	};
	
	objectFunctions.getMixer = function(aName) {
		//console.log("com.developedbyme.core.globalobjects.audiomanager.AudioManager::getMixer");
		
		return this._mixers.getObject(aName);
	};
	
	objectFunctions.createMixer = function(aName, aParentMixerName) {
		//console.log("com.developedbyme.core.globalobjects.audiomanager.AudioManager::createMixer");
		
		var newMixer = this._mixers.getObject(aParentMixerName).createMixer();
		this._mixers.addObject(aName, newMixer);
		
		return newMixer;
	};
	
	objectFunctions.createChannel = function(aMixerName) {
		//console.log("com.developedbyme.core.globalobjects.audiomanager.AudioManager::createChannel");
		
		var newChannel = this._mixers.getObject(aMixerName).createChannel();
		
		return newChannel;
	};
	
	objectFunctions.playAudio = function(aId, aVolume, aLoop, aMixerName) {
		//console.log("com.developedbyme.core.globalobjects.audiomanager.AudioManager::playAudio");
		
		aVolume = VariableAliases.valueWithDefault(aVolume, 1);
		aLoop = VariableAliases.valueWithDefault(aLoop, false);
		aMixerName = VariableAliases.valueWithDefault(aMixerName, "audio");
		
		var audioAsset;
		if(PathFunctions.getFileExtension(aId) === null) {
			audioAsset = dbm.singletons.dbmAssetRepository.getAsset(dbm.singletons.dbmAssetRepository.getAudioPath(aId));
		}
		else {
			audioAsset = dbm.singletons.dbmAssetRepository.getAsset(aId);
		}
		
		if(audioAsset.getStatus() === AssetStatusTypes.NOT_LOADED) {
			audioAsset.load();
		}
		
		var audioTag = audioAsset.getData();
		
		//MENOTE: Safari dies when you have duplicates of audio tags
		//var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(dbm.singletons.dbmPageManager.getDocument());
		//var newAudioTag = htmlCreator.createNode("audio", {"preload": "auto"});
		//newAudioTag.src = audioTag.src;
		//newAudioTag.loop = aLoop;
		//dbm.singletons.dbmPageManager.getDocument().body.appendChild(newAudioTag);
		//newAudioTag.load();
		
		//MENOTE: playing a new sounds needs to kill the old sound until safari fixes the bug with duplicating audio node.
		var currentArray = this._playingAudio;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentPlayingAudio = currentArray[i];
			if(currentPlayingAudio.getElement() === audioTag) {
				currentPlayingAudio.stop();
				currentPlayingAudio.destroy();
				break;
			}
		}
		
		var mixerChannel = this.getMixer(aMixerName).createChannel(aId, aVolume);
		//var newPlayingAudio = PlayingAudio.create(aId, newAudioTag, mixerChannel);
		var newPlayingAudio = PlayingAudio.create(aId, audioTag, mixerChannel);
		newPlayingAudio.setPropertyInput("volume", aVolume);
		newPlayingAudio.getProperty("loop").setValue(aLoop);
		newPlayingAudio.play();
		
		this._playingAudio.push(newPlayingAudio);
		
		return newPlayingAudio;
	};
	
	objectFunctions.createAudioPlayer = function(aId, aVolume, aLoop) {
		//console.log("com.developedbyme.core.globalobjects.audiomanager.AudioManager::createAudioPlayer");
		
		aVolume = VariableAliases.valueWithDefault(aVolume, 1);
		aLoop = VariableAliases.valueWithDefault(aLoop, false);
		
		var audioAsset;
		if(PathFunctions.getFileExtension(aId) === null) {
			audioAsset = dbm.singletons.dbmAssetRepository.getAsset(dbm.singletons.dbmAssetRepository.getAudioPath(aId));
		}
		else {
			audioAsset = dbm.singletons.dbmAssetRepository.getAsset(aId);
		}
		
		if(audioAsset.getStatus() === AssetStatusTypes.NOT_LOADED) {
			audioAsset.load();
		}
		
		var audioTag = audioAsset.getData();
		
		//MENOTE: Safari dies when you have duplicates of audio tags
		//var htmlCreator = dbm.singletons.dbmHtmlDomManager.getHtmlCreator(dbm.singletons.dbmPageManager.getDocument());
		//var newAudioTag = htmlCreator.createNode("audio", {"preload": "auto"});
		//newAudioTag.src = audioTag.src;
		//newAudioTag.loop = aLoop;
		//dbm.singletons.dbmPageManager.getDocument().body.appendChild(audioTag);//MEDEBUG
		//newAudioTag.load();
		
		//var newAudioPlayer = AudioPlayer.createWithNode(newAudioTag);
		
		var newAudioPlayer = AudioPlayer.createWithNode(audioTag);
		newAudioPlayer.setPropertyInput("volume", aVolume);
		
		return newAudioPlayer;
	};
	
	objectFunctions._linkRegistration_removePlayingAudio = function(aPlayingAudio) {
		var index = ArrayFunctions.indexOfInArray(this._playingAudio, aPlayingAudio);
		
		if(index !== -1) {
			this._playingAudio.splice(index, 1);
		}
	};
});