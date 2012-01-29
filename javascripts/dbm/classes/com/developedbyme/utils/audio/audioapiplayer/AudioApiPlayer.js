dbm.registerClass("com.developedbyme.utils.audio.audioapiplayer.AudioApiPlayer", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.audio.audioapiplayer.AudioApiPlayer");
	
	var AudioApiPlayer = dbm.importClass("com.developedbyme.utils.audio.audioapiplayer.AudioApiPlayer");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var UpdateChain = dbm.importClass("com.developedbyme.core.globalobjects.updatemanager.objects.UpdateChain");
	var ArrayHolder = dbm.importClass("com.developedbyme.utils.data.ArrayHolder");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.audio.audioapiplayer.AudioApiPlayer::init");
		
		this.superCall();
		
		this._context = new webkitAudioContext();
		this._updaters = new Array();
		
		this._isPlaying = false;
		this._startTime = -1;
		this._contextStartTime = -1;
		this._startPosition = -1;
		
		this._audioDecoders = ArrayHolder.create(true);
		this._addDestroyableObject(this._audioDecoders);
		
		return this;
	};
	
	objectFunctions.updateTime = function(aTime, aFrame) {
		//console.log("com.developedbyme.utils.audio.audioapiplayer.AudioApiPlayer::updateTime");
		
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
	
	objectFunctions.createAudioDataDecoder = function(aData) {
		
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
		this._updateChain = null;
		
		this.superCall();
	};
	
	staticFunctions.create = function() {
		var newNode = (new ClassReference()).init();
		
		return newNode;
	};
});