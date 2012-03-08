dbm.registerClass("com.developedbyme.utils.audio.audioapiplayer.AudioApiPlayer", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.audio.audioapiplayer.AudioApiPlayer");
	
	var AudioApiPlayer = dbm.importClass("com.developedbyme.utils.audio.audioapiplayer.AudioApiPlayer");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var UpdateChain = dbm.importClass("com.developedbyme.core.globalobjects.updatemanager.objects.UpdateChain");
	var ArrayHolder = dbm.importClass("com.developedbyme.utils.data.ArrayHolder");
	var AudioDataDecoder = dbm.importClass("com.developedbyme.utils.audio.audioapiplayer.AudioDataDecoder");
	var Note = dbm.importClass("com.developedbyme.utils.audio.audioapiplayer.notes.Note");
	var NamedArray = dbm.importClass("com.developedbyme.utils.data.NamedArray");
	
	var VariableAliases = dbm.importClass("com.developedbyme.utils.data.VariableAliases");
	
	staticFunctions.MASTER_GAIN_NODE_NAME = "masterGain";
	staticFunctions.DYNAMIC_PROCESSOR_NODE_NAME = "dynamicProcessor";
	
	objectFunctions._init = function() {
		//console.log("com.developedbyme.utils.audio.audioapiplayer.AudioApiPlayer::_init");
		
		this.superCall();
		
		this._context = this._createAudioContext();
		this._mainOutput = this._context.destination;
		this._updaters = new Array();
		
		this._isPlaying = false;
		this._startTime = -1;
		this._contextStartTime = -1;
		this._startPosition = -1;
		
		this._audioDecoders = ArrayHolder.create(true);
		this.addDestroyableObject(this._audioDecoders);
		
		this._nodes = NamedArray.create(true);
		this.addDestroyableObject(this._nodes);
		
		return this;
	};
	
	objectFunctions._createAudioContext = function() {
		return new webkitAudioContext();
	};
	
	objectFunctions.getContext = function() {
		return this._context;
	};
	
	objectFunctions.getMainOutput = function() {
		return this._mainOutput;
	};
	
	objectFunctions.setMainOutput = function(aNode) {
		this._mainOutput = aNode;
	};
	
	objectFunctions.getNode = function(aName) {
		return this._nodes.getObject(aName);
	};
	
	objectFunctions.addNode = function(aName, aNode) {
		this._nodes.addObject(aName, aNode);
	};
	
	objectFunctions.setupMastarGainNode = function() {
		var newNode = this.getContext().createGainNode();
		
		newNode.connect(this._mainOutput);
		this._mainOutput = newNode;
		
		this._nodes.addObject(ClassReference.MASTER_GAIN_NODE_NAME, newNode);
		
		return this;
	};
	
	objectFunctions.setupDynamicProcessorNode = function() {
		var newNode = this.getContext().createDynamicsCompressor();
		
		newNode.connect(this._mainOutput);
		this._mainOutput = newNode;
		
		this._nodes.addObject(ClassReference.DYNAMIC_PROCESSOR_NODE_NAME, newNode);
		
		return this;
	};
	
	objectFunctions.setupMasterGainAndDynamicProcessor = function() {
		this.setupDynamicProcessorNode();
		this.setupMastarGainNode();
		
		return this;
	};
	
	objectFunctions.createNote = function(aBuffer, aLoop, aPlaybackSpeed, aDuration) {
		
		aLoop = VariableAliases.valueWithDefault(aLoop, false);
		aPlaybackSpeed = VariableAliases.valueWithDefault(aPlaybackSpeed, 1);
		aDuration = VariableAliases.valueWithDefault(aDuration, -1);
		
		var newSource = this.getContext().createBufferSource();
		newSource.buffer = aBuffer;
		newSource.loop = aLoop;
		newSource.playbackRate.value = aPlaybackSpeed;
		
		var newNote = Note.create(this._context, newSource, aDuration);
		
		return newNote;
	};
	
	objectFunctions.updateTime = function(aTime, aFrame) {
		//console.log("com.developedbyme.utils.audio.audioapiplayer.AudioApiPlayer::updateTime");
		//console.log(aTime, aFrame);
		
		var currentTime = (aTime-this._startTime)+this._startPosition;
		
		var currentArray = this._updaters;
		var currentArrayLength = currentArray.length;
		for(var i = 0; i < currentArrayLength; i++) {
			var currentUpdater = currentArray[i];
			currentUpdater.update(this._context, currentTime, this._contextStartTime);
		}
		
		return this;
	};
	
	objectFunctions.start = function() {
		if(this._isPlaying) return;
		this._isPlaying = true;
		
		this._startTime = dbm.singletons.dbmUpdateManager.currentTime;
		this._contextStartTime = this._context.currentTime;
		this._startPosition = 0;
		
		dbm.singletons.dbmUpdateManager.addUpdater(this, "default");
		
		return this;
	};
	
	objectFunctions.stop = function() {
		if(!this._isPlaying) return;
		this._isPlaying = false;
		dbm.singletons.dbmUpdateManager.removeUpdater(this, "default");
		
		return this;
	};
	
	objectFunctions.addUpdater = function(aUpdater) {
		this._updaters.push(aUpdater);
	}
	
	objectFunctions.createAudioDataDecoder = function(aData) {
		
		var newAudioDecoder = AudioDataDecoder.create(this._context, aData);
		//MENOTE: why store the decoders
		this._audioDecoders.array.push(newAudioDecoder);
		
		return newAudioDecoder;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		//switch(aName) {
		//	case PlaybackExtendedEventIds.META_DATA_LOADED:
		//		return true;
		//}
		
		return this.superCall(aName);
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("com.developedbyme.utils.audio.audioapiplayer.AudioApiPlayer::setAllReferencesToNull");
		
		this._context = null;
		this._mainOutput = null;
		this._updateChain = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newNode = (new ClassReference()).init();
		
		return newNode;
	};
	
	staticFunctions.createWithMasterGainAndDynamicProcessor = function() {
		var newNode = (new ClassReference()).init();
		newNode.setupMasterGainAndDynamicProcessor();
		return newNode;
	};
});