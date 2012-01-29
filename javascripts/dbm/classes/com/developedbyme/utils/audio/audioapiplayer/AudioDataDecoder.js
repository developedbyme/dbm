dbm.registerClass("com.developedbyme.utils.audio.audioapiplayer.AudioDataDecoder", "com.developedbyme.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("com.developedbyme.utils.audio.audioapiplayer.AudioDataDecoder");
	
	var AudioDataDecoder = dbm.importClass("com.developedbyme.utils.audio.audioapiplayer.AudioDataDecoder");
	
	var ErrorManager = dbm.importClass("com.developedbyme.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("com.developedbyme.constants.ReportTypes");
	var ReportLevelTypes = dbm.importClass("com.developedbyme.constants.ReportLevelTypes");
	
	var UpdateChain = dbm.importClass("com.developedbyme.core.globalobjects.updatemanager.objects.UpdateChain");
	
	objectFunctions.init = function() {
		//console.log("com.developedbyme.utils.audio.audioapiplayer.AudioDataDecoder::init");
		
		this.superCall();
		
		this._context = null;
		this._data = null;
		this._buffer = null;
		
		var thisPointer = this;
		this._successCallback = function(aBuffer) {
			thisPointer._bufferCreated(aBuffer);
		};
		
		this._errorCallback = function(aError) {
			thisPointer._errorCreatingBuffer(aError);
		};
		
		return this;
	};
	
	objectFunctions._bufferCreated = function(aBuffer) {
		console.log("com.developedbyme.utils.audio.audioapiplayer.AudioDataDecoder::_bufferCreated");
		this._buffer = aBuffer;
	};
	
	objectFunctions._errorCreatingBuffer = function(aError) {
		console.log("com.developedbyme.utils.audio.audioapiplayer.AudioDataDecoder::_errorCreatingBuffer");
	};
	
	objectFunctions.setup = function(aContext, aData) {
		
		this._context = aContext;
		this._data = aData;
		
		return this
	};
	
	objectFunctions.startDecoding = function() {
		this._context.decodeAudioData(aContext, aData, this._successCallback, this._errorCallback);
		
		return  this;
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
		//console.log("com.developedbyme.utils.audio.audioapiplayer.AudioDataDecoder::setAllReferencesToNull");
		
		this.superCall();
	};
	
	staticFunctions.create = function(aContext, aData) {
		var newNode = (new ClassReference()).init();
		
		return newNode;
	};
});