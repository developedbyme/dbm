/* Copyright (C) 2011-2014 Mattias Ekendahl. Used under MIT license, see full details at https://github.com/developedbyme/dbm/blob/master/LICENSE.txt */
dbm.registerClass("dbm.utils.audio.audioapiplayer.AudioDataDecoder", "dbm.core.ExtendedEventBaseObject", function(objectFunctions, staticFunctions, ClassReference) {
	//console.log("dbm.utils.audio.audioapiplayer.AudioDataDecoder");
	
	var AudioDataDecoder = dbm.importClass("dbm.utils.audio.audioapiplayer.AudioDataDecoder");
	
	var ErrorManager = dbm.importClass("dbm.core.globalobjects.errormanager.ErrorManager");
	var ReportTypes = dbm.importClass("dbm.constants.error.ReportTypes");
	var ReportLevelTypes = dbm.importClass("dbm.constants.error.ReportLevelTypes");
	
	var UpdateChain = dbm.importClass("dbm.core.globalobjects.updatemanager.objects.UpdateChain");
	
	var ProcessStatusTypes = dbm.importClass("dbm.constants.status.ProcessStatusTypes");
	var ProcessExtendedEventIds = dbm.importClass("dbm.constants.extendedevents.ProcessExtendedEventIds");
	
	objectFunctions._init = function() {
		//console.log("dbm.utils.audio.audioapiplayer.AudioDataDecoder::_init");
		
		this.superCall();
		
		this._context = null;
		this._data = null;
		this._buffer = null;
		this._status = ProcessStatusTypes.NOT_STARTED;
		
		var thisPointer = this;
		this._successCallback = function(aBuffer) {
			thisPointer._bufferCreated(aBuffer);
		};
		
		this._errorCallback = function(aError) {
			thisPointer._errorCreatingBuffer(aError);
		};
		
		return this;
	};
	
	objectFunctions.getStatus = function() {
		return this._status;
	};
	
	objectFunctions._bufferCreated = function(aBuffer) {
		console.log("dbm.utils.audio.audioapiplayer.AudioDataDecoder::_bufferCreated");
		this._buffer = aBuffer;
		
		this._status = ProcessStatusTypes.DONE;
		
		if(this.getExtendedEvent().hasEvent(ProcessExtendedEventIds.DONE)) {
			this.getExtendedEvent().perform(ProcessExtendedEventIds.DONE, aBuffer);
		}
	};
	
	objectFunctions._errorCreatingBuffer = function(aError) {
		console.log("dbm.utils.audio.audioapiplayer.AudioDataDecoder::_errorCreatingBuffer");
		console.log(aError);
		
		this._status = ProcessStatusTypes.ERROR;
		
		if(this.getExtendedEvent().hasEvent(ProcessExtendedEventIds.ERROR)) {
			this.getExtendedEvent().perform(ProcessExtendedEventIds.ERROR, aError);
		}
	};
	
	objectFunctions.setup = function(aContext, aData) {
		
		this._context = aContext;
		this._data = aData;
		
		return this;
	};
	
	objectFunctions.getBuffer = function() {
		return this._buffer;
	};
	
	objectFunctions.startProcess = function() {
		this._status = ProcessStatusTypes.STARTED;
		this._context.decodeAudioData(this._data, this._successCallback, this._errorCallback);
		
		return  this;
	};
	
	objectFunctions._extendedEvent_eventIsExpected = function(aName) {
		
		switch(aName) {
			case ProcessExtendedEventIds.DONE:
			case ProcessExtendedEventIds.ERROR:
				return true;
		}
		
		return this.superCall(aName);
	};
	
	objectFunctions._toString_getAttributes = function(aReturnArray) {
		this.superCall(aReturnArray);
	};
	
	objectFunctions.setAllReferencesToNull = function() {
		//console.log("dbm.utils.audio.audioapiplayer.AudioDataDecoder::setAllReferencesToNull");
		
		this.superCall();
	};
	
	staticFunctions.create = function(aContext, aData) {
		var newNode = (new ClassReference()).init();
		newNode.setup(aContext, aData);
		return newNode;
	};
});