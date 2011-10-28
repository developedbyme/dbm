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
	
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	
	var ArrayFunctions = dbm.importClass("com.developedbyme.utils.native.array.ArrayFunctions");
	var PathFunctions = dbm.importClass("com.developedbyme.utils.file.PathFunctions");
	
	dbm.setClassAsSingleton("dbmAudioManager");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.core.globalobjects.audiomanager.AudioManager::init");
		
		this.superCall();
		
		this._mainMixer = Mixer.create();
		this._globalMasterChannel = this._mainMixer.getMasterChannel();
		
		this._mixers = NamedArray.create(false);
		this._mixers.addObject("master", this._mainMixer);
		
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
	
	objectFunctions.playSound = function(aId) {
		//console.log("com.developedbyme.core.globalobjects.audiomanager.AudioManager::createChannel");
		
		var audioTag = dbm.singletons.dbmAssetRepository.getAssetData(aId);
		var newAudioTag = dbm.singletons.dbmPageManager.getDocument().cloneNode(audioTag);
		newAudioTag.play();
		return newAudioTag;
	};
});